import {tweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
if(!data){
    console.log('local storage has been set')
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData))}
const data = JSON.parse(localStorage.getItem('tweetsData'))

let updatedData = [...data]

const feed = document.getElementById('feed')


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply) 
    }else if(e.target.id == 'tweet-btn'){
        handleTweetBtn()
    }else if(e.target.dataset.replybtn){
       
        handleReplyBtnClick(e.target.dataset.replybtn)
        
    }else if(e.target.dataset.delete){
        handleDelete(e.target.dataset.delete)
    }
})





function handleLikeClick(tweetId){
    
    const targetTweetObj = updatedData.filter(tweet => tweet.uuid === tweetId)[0];
    if(targetTweetObj.isLiked){
        targetTweetObj.likes --;
        
    }else{
        targetTweetObj.likes ++;
        
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render() 

}

function handleRetweetClick(tweetId){
    
    const targetTweetObj = updatedData.filter(tweet => tweet.uuid === tweetId)[0];
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets --;
        
    }else{
        targetTweetObj.retweets ++;
        
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()

}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
}

function handleTweetBtn() {
    const tweetInput = document.getElementById('tweet-input')
    
    if(tweetInput.value){
        updatedData.unshift({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    })
    tweetInput.value = ''
    render()
    }
}
function handleReplyBtnClick(tweetId) {
    const replyInput = document.getElementById(`reply-${tweetId}`)
    const targetTweetObj = updatedData.filter(tweet => tweet.uuid == tweetId)[0]
   if(replyInput.value){
     targetTweetObj.replies.unshift(
        {
            handle: `@Scrimba`,
            profilePic: "images/scrimbalogo.png",
            tweetText: replyInput.value

        }
    )
    replyInput.value = ''
    render()
    handleReplyClick(tweetId)
   }


}

function handleDelete(tweetId) {
    updatedData = updatedData.filter(tweet => tweet.uuid != tweetId)
    render()
}

function getFeedHtml() {
     let feedHtml = ``
     updatedData.forEach( tweet => {
        let likeClass = tweet.isLiked ? "fa-solid fa-thumbs-up liked" : "fa-solid fa-thumbs-up";
        let retweetClass = tweet.isRetweeted ? "fa-solid fa-retweet retweeted" : "fa-solid fa-retweet";
        let repliesHtml = `
        <div class='reply-textarea' >
        <textarea id='reply-${tweet.uuid}' data-replyarea='${tweet.uuid}' class='reply-input' type="text" placeholder='reply' ></textarea>
        
        <button data-replybtn='${tweet.uuid}' class='reply-btn' >Reply</button>
        </div>`
        if(tweet.replies.length>0){
            tweet.replies.forEach(reply => 
            repliesHtml+= `
            <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>`
            )
        }


        

         feedHtml += `
        <div class="tweet">
    <div class="tweet-inner">
        <img src=${tweet.profilePic} class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply='${tweet.uuid}'></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="${likeClass}" data-like='${tweet.uuid}'></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="${retweetClass}" data-retweet='${tweet.uuid}'></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash" data-delete='${tweet.uuid}'></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>`
     })
       
     
return feedHtml;
}

function render() {
    localStorage.setItem('tweetsData', JSON.stringify(updatedData))
    
    feed.innerHTML = getFeedHtml()
}

render()
