<script setup lang="ts">
import { isJSDocReturnTag } from 'typescript';

    type Props = {
        loginUid: number,
    }
    const props = defineProps<Props>()
    
    type Emits = {
        logout: {},
    }
    const emit = defineEmits<Emits>()
    
    const { data: userData } = useFetch(() => `/api/people/${props.loginUid}`)
    
    const radioId: Ref<number | null> = ref(null)
    const radioActions = [
        {label: "Select", classes: {use: true}, action: (rid: number) => radioId.value = rid},
    ]
    const { data: radioData, refresh: radioRefresh } = useFetch(() => `/api/radios/${radioId.value}`, {
        immediate: false,
    })
    watch(radioId, () => {
        if(radioId.value) radioRefresh()
    })
    
    const personId: Ref<number | null> = ref(null)
    const peopleActions = [
        {label: "Select", classes: {use: true}, action: (pid: number) => personId.value = pid},
    ]
    const { data: personData, refresh: personRefresh } = useFetch(() => `/api/people/${personId.value}`, {
        immediate: false,
    })
    watch(personId, () => {
        if(personId.value) personRefresh()
    })
    watch(radioData, () => {
        personId.value = radioData.value?.holder?.pid ?? null
    })
    
    const dateToDT = (d: Date) => {
        const clone = new Date(d)
        clone.setMinutes(clone.getMinutes() - clone.getTimezoneOffset())
        return clone.toISOString().slice(0, 16)
    }
    
    const checkoutAt = ref(0)
    watch([radioId, personId], () => checkoutAt.value = Date.now())
    const checkoutComment = ref('')
    const checkoutRadio = async () => {
        await $fetch('/api/moveRadio', {
            method: 'POST',
            body: {
                auditor: props.loginUid,
                possessor: personId.value,
                radio: radioId.value,
                at: checkoutAt.value,
                kind: 'checkout',
                note: checkoutComment.value.length > 0 ? checkoutComment.value : undefined,
            }
        })
        checkoutComment.value = ''
        personId.value = null
        returnAt.value = Date.now()
        radioRefresh()
    }
    
    const customComment = ref('')
    const postComment = async () => {
        if(!radioData.value?.holder?.moveId) return
        await $fetch('/api/postComment', {
            method: 'POST',
            body: {
                moveId: radioData.value.holder.moveId,
                commenter: props.loginUid,
                comment: customComment.value,
                at: Date.now(),
            }
        })
        customComment.value = ''
        radioRefresh()
    }
    
    const returnComment = ref('')
    const returnAt = ref(0)
    watch(radioId, () => returnAt.value = Date.now())
    const returnRadio = async () => {
        await $fetch('/api/moveRadio', {
            method: 'POST',
            body: {
                auditor: props.loginUid,
                possessor: null,
                radio: radioId.value,
                at: returnAt.value,
                kind: 'checkin',
                note: returnComment.value.length > 0 ? returnComment.value : undefined,
            }
        })
        returnComment.value = ''
        radioRefresh()
    }
</script>

<template>
    <p class="loginStatus">Logged in as
        <span v-if="userData" class="emph">{{ userData.dispName }}.</span>
        <span v-else class="emph error">{{ loginUid }}.</span>
        &nbsp;
        <button class="delete" @click="emit('logout', {})">Log Out</button>
    </p>
    
    <h1>Move Radio</h1>
    <div class="columns">
        <div>
            <SearchTable
                :fields="['identifier']"
                rest-path="/api/radios"
                :actions="radioActions"
            />
            <p v-if="radioId" class="info">
                Selected radio <span class="emph">{{ radioId }} ({{ radioData?.identifier }})</span>.
                &nbsp;<button class="delete" @click="radioId = null">Deselect</button>
            </p>
            <p v-if="radioData" class="info">
                That radio is
                <span v-if="radioData.holder?.pid">
                    checked out to
                    <span v-if="radioData.holder.dispName && radioData.holder.realName" class="emph">
                        {{ radioData.holder.dispName }}, {{ radioData.holder.realName }}.
                    </span>
                    <span v-else class="emph error">unknown user {{ radioData.holder.pid }}.</span>
                    <form class="rows-center" @submit.prevent="returnRadio">
                        <input type="text" v-model="returnComment" placeholder="Comment (optional)"/>
                        <input
                            type="datetime-local"
                            :value="dateToDT(new Date(returnAt))"
                            @input="(event) => returnAt = (new Date(event.target.value)).getTime()"
                        />
                        <button class="delete" type="submit">Return</button>
                    </form>
                </span>
                <span v-else>available to check out.</span>
                <div v-if="!radioData.moveComments">
                    There is no most recent movement to comment on.
                </div>
                <div v-else>
                    Comments:
                    <form class="rows-center" @submit.prevent="postComment">
                        <textarea name="comment" v-model="customComment"></textarea>
                        <button type="submit" class="use">Post</button>
                    </form>
                    <div v-for="comment in radioData.moveComments" class="comment">
                        <div class="author">
                            <span v-if="comment.dispName">{{ comment.dispName }}</span>
                            <span v-else>{{ comment.commenter }}</span>
                        </div>
                        <div class="time">{{ (new Date(comment.at)).toString() }}</div>
                        <div class="text">{{ comment.comment }}</div>
                    </div>
                </div>
            </p>
        </div>
        <div>
            <SearchTable
                :fields="['dispName', 'realName']"
                rest-path="/api/people"
                :actions="peopleActions"
            />
            <p v-if="personId" class="info">
                Selected person <span class="emph">{{ personId }} ({{ personData?.dispName }}, {{ personData?.realName }})</span>.
                &nbsp;<button class="delete" @click="personId = null">Deselect</button>
            </p>
            <p v-if="personData" class="info">
               <span v-if="personData.holds?.length > 0">
                    They have checked out the following equipment:
                    <ul class="checked-out">
                        <li v-for="radio in personData.holds">
                            <span class="emph">{{ radio.identifier }}</span>
                            &nbsp;<button class="use" @click="radioId = radio.id">Select</button>
                        </li>
                    </ul>
               </span>
               <span v-else>
                    They have no equipment checked out.
               </span>
            </p>
        </div>
    </div>
    <div v-if="personId && radioId">
        <form class="rows-center" @submit.prevent="checkoutRadio">
            <input type="text" v-model="checkoutComment" placeholder="Comment (optional)"/>
            <input
                type="datetime-local"
                :value="dateToDT(new Date(checkoutAt))"
                @input="(event) => checkoutAt = (new Date(event.target.value)).getTime()"
            />
            &nbsp;<button type="submit" class="use">Check Out</button>
        </form>
    </div>
</template>

<style>
.columns {
    display: flex;
    justify-content: space-evenly;
}

.rows-center {
    display: flex;
    flex-flow: column nowrap;
}
    
.comment .author {
    font-weight: bold;
    margin-top: 1ex;
}
    
.comment .time {
    font-style: italic;
}
    
span.emph {
    font-weight: bold;
}

span.error {
    color: #f00;
}
</style>