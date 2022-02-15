const socket=io()

const $messageform= document.querySelector('#message-form')
const $sendlocation=document.querySelector('#send-location')
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')

const $messages=document.querySelector('#messages')
const $urls=document.querySelector('#urls')
const urltemplate=document.querySelector('#url-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML
const $sidebar=document.querySelector('#sidebar')
const messagetemplate=document.querySelector('#message-template').innerHTML

//option
const{username,room} =Qs.parse(location.search,{ignoreQueryPrefix :true})

const autoscroll=()=>{
    //new message
    const $newMessage=$messages.lastElementChild

    //heightof new message
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=newMessageMargin+$newMessage.offsetHeight

    //visible height
    const visibleheight=$messages.offsetHeight

    //height of message container
    const containerHeight= $messages.scrollHeight

    //height scrolled
    const scrollOffset=$messages.scrollTop+visibleheight

    if(containerHeight-newMessageHeight <=scrollOffset){
            $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('locationMessage',(url)=>{
    const html=Mustache.render(urltemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomdata',({room,users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    $sidebar.innerHTML=html
})

$messageform.addEventListener('submit',(e)=>{
    e.preventDefault() //prvebt defaultbehaviour
    $messageformbutton.setAttribute('disabled','disabled')

    var msg=e.target.elements.message.value
    socket.emit('sendMessage',msg,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log('The message delivered')
    })
})

$sendlocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported')
    }

    $sendlocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
            
            console.log(position)
            socket.emit('sendLocation',{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
                $sendlocation.removeAttribute('disabled')
                console.log('location shared')
            })
        }
    )
})

socket.emit('join',{username,room},(error)=>{
    if(error) {
        alert(error)
        location.href='/'
    }
})
