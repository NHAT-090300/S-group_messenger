$(document).ready(function(){
    const socket = io();

    let ChatosExamle = {
        Message: {
            add: function (message, time, type) {
                var chat_body = $('.layout .content .chat .chat-body');
                if (chat_body.length > 0) {
                    type = type ? type : '';
                    message = message ? message : 'Lorem ipsum dolor sit amet.';
                    $('.layout .content .chat .chat-body .messages').append('<div class="message-item ' + type + '"><div class="message-content">' + message + '</div><div class="message-action">'+ time + (type ? '<i class="ti-check"></i>' : '') + '</div></div>');
                    chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                        cursorcolor: 'rgba(66, 66, 66, 0.20)',
                        cursorwidth: "4px",
                        cursorborder: '0px'
                    }).resize();
                }
            },
            open: function(id) {
                $('.chat-footer').append(`<form action=""><input class="form-control messageUser" name="message" type="text" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2"/><div class="form-buttons"><button class="btn btn-light btn-floating" type="button"><i class="fa fa-paperclip"></i></button><button class="btn btn-light btn-floating" type="button"><i class="fa fa-microphone"></i></button><button class="btn btn-primary btn-floating tinnhan" id="sendMessages_${id}" type="submit"><i class="fa fa-send"></i></button></div></form>`);
            }
        },
        Requests: {
            ListYourRequests: function (firendId, avatar, firstName, lastName, message) {
                let li = $(`<li class="list-group-item" id="li${firendId}"><div><figure class="avatar"><img class="rounded-circle" src="${avatar}"></figure></div><div class="users-list-body"><h5>${firstName} ${lastName}</h5><p>${message}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right"  id="${firendId}"><a class="dropdown-item active profile" data-navigation-target='contact-information'>Profile</a><a class="dropdown-item notAccept">Delete</a></div></div></div></div></li>`);
                $('#requestsAcceptForYou').append(li);
            },
            listThierRequests: function(userId, avatar, firstName, lastName, message){
                let li = $(`<li class="list-group-item" id="li_${userId}"><div><figure class="avatar"><img class="rounded-circle" src="${avatar}"></figure></div><div class="users-list-body"><h5>${firstName} ${lastName}</h5><p>${message}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right"  id="friendId_${userId}"><a class="dropdown-item accept">Accept</a><a class="dropdown-item active profileFriends" data-navigation-target='contact-information'>Profile</a><a class="dropdown-item delete">Delete</a></div></div></div></div></li>`);
                $('#acceptedFriends').append(li);
            }
        },
        Friends: {
            listFriends: function (id, avatar, firstName, lastName, message) {
                let li = $(`<li class="list-group-item li__${id}" id="li__${id}"><div><figure class="avatar"><img class="rounded-circle" src="${avatar}"></figure></div><div class="users-list-body"><h5>${firstName} ${lastName}</h5><p>${message}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right"  id="${id}"><a class="dropdown-item openMessage"> Open </a><a class="dropdown-item active info" data-navigation-target='contact-information'> Profile </a><a class="dropdown-item cancelFriends"> Delete </a></div></div></div></div></li>`);
                $('#listAllFriends').append(li);
            },
            listFriendsChats: function(id, avatar, firstName, lastName, message) {
                let li = $(`<li class="list-group-item" id="li__${id}"><div><figure class="avatar"><img class="rounded-circle" src="${avatar}"></figure></div><div class="users-list-body"><h5>${firstName} ${lastName}</h5><p>${message}</p><div class="users-list-action action-toggle"><div class="dropdown"><a data-toggle="dropdown" href="#"><i class="ti-more"></i></a><div class="dropdown-menu dropdown-menu-right"  id="${id}"><a class="dropdown-item openMessage"> Open </a><a class="dropdown-item active info" data-navigation-target='contact-information'> Profile </a></div></div></div></div></li>`);
                $('.list-chats').append(li);
            }
        }
    };

    let active = {
        li: function(id) {
            $('ul li').removeClass('open-chat');
            $('ul #li__'+id).addClass('open-chat');
        },
    }
    // form add-friends toggle 
    $('#toggle-addFriends').on('click', ()=> {
        $('#email').val('');
        $('#phoneNumber').val('');
        $('#message').val('');
        $('#display-1').toggle();
        $('#display-2').toggle();
    })
    // api add friends
    $('#addFriends').submit(function (event) {
        event.preventDefault();
        const addAudio = new Audio('http://taira-komori.jpn.org/sound_os/game01/poka03.mp3');
        const errAudio = new Audio("http://taira-komori.jpn.org/sound_os/attack01/punch2a.mp3");
        const email = $('#email').val();
        const phoneNumber = $('#phoneNumber').val();
        const message = $('#message').val();
        $.ajax({
            url: '/v1/add-friends',
            type: 'POST',
            data: {
                email,
                phoneNumber,
                message
            }
        }).then((data) => {
            addAudio.play();
            listYourRequests();
            listThierRequests()
            $.notify(data, "success");
        }).catch((error) => {
            errAudio.play();
            $.notify(`you can't add new friends`, 'info');
        })
    })
    // list friends your invitation
    function listYourRequests() {
        $.ajax({
            url: '/v1/friends-your-invitation',
            type: 'GET'
        })
        .then((data)=> {
            $('#requestsAcceptForYou').html('');
            for(let i = 0; i < data.data.length; i++) {
                let element = data.data[i];

                ChatosExamle.Requests.ListYourRequests(element.firendId, element.avatar, element.firstName, element.lastName, element.message);

                $('.notAccept').on('click', function (){
                    NotAcceptFriends($(this).parent().attr('id'),1);
                    $('#li' + $(this).parent().attr('id')).hide();
                });
                $('.profile').on('click', function (){
                    profileFriend($(this).parent().attr('id'));
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    // list all friends have accepted
    function load(){
        $.ajax({
            url: '/v1/list-all-friends',
            type: 'GET',
        }).then((data) => {
            console.log(data)
            $('#listAllFriends').html('');
            $('.list-chats').html('');
            for( i=0; i<data.length; i++) {
                let id;
                let element = data[i];
                console.log(data[i].avatar)
                if(!element.userId) {
                    id = element.firendId
                } else {
                    id = element.userId
                };

                ChatosExamle.Friends.listFriends(id, element.avatar, element.firstName, element.lastName, element.message);
                ChatosExamle.Friends.listFriendsChats(id, element.avatar, element.firstName, element.lastName, element.message);

                $('.cancelFriends').on('click',async function() {
                    const id = $(this).parent().attr('id');
                    $('.li__'+id).hide();
                    await NotAcceptFriends(id , 2);
                });
                $('.info').on('click', function() {
                    const id = $(this).parent().attr('id');
                    profileFriend(id);
                    active.li(id);
                });
                $('.openMessage').on('click', function() {
                    const id = $(this).parent().attr('id');
                    active.li(id);
                    openMessage(id);
                    allMessages(id);
                });
            }
        })
    }
    // list friends their invitation
    function listThierRequests() {
        $.ajax({
            url: '/v1/list-friends',
            type: 'GET'
        })
        .then((data)=> {
            $('#acceptedFriends').html('');
            for(let i = 0; i < data.length; i++) {
                let element = data[i];

                ChatosExamle.Requests.listThierRequests(element.userId, element.avatar, element.firstName, element.lastName, element.message);

                $('.accept').on('click',async function(){
                    const id = $(this).parent().attr('id').split('_')[1];
                    $('#li_'+ id).hide();
                    await update(id);
                    $.ajax({
                        url: '/v1/info-friend/' + id,
                        method: 'GET'
                    }).then((data) => {
                        const element = data.data[0];
                        ChatosExamle.Friends.listFriends(id, element.avatar, element.firstName, element.lastName, element.message);
                    });
                });
                $('.delete').on('click',async function(){
                    const id = $(this).parent().attr('id').split('_')[1];
                    $('#li_' + id).hide();
                    await NotAcceptFriends(id, 1);
                });
                $('.profileFriends').on('click', function(){
                    profileFriend($(this).parent().attr('id').split('_')[1]);
                });
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
    // accept friends
    function update(id) {
        $.ajax({
            url: '/v1/accept-friend/' + id,
            method: 'PUT',
        }).then((data)=> {
            console.log(data)
        }).catch((error)=> {
            console.log(error);
        })
    }
    // delete invation
    async function NotAcceptFriends(id, status) {
        try {
            await $.ajax({
                url: '/v1/not-accept-friend/' + id,
                method: 'DELETE',
                data: {
                    status
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    // profile friends findById
    function profileFriend(id) {
        $.ajax({
            url: '/v1/info-friend/' + id,
            method: 'GET'
        }).then((data)=> {
            const element = data.data[0];
            $('.avatarFriend').html('');
            $('.nameFriend').html('');
            $('#phone').html('');
            $('#city').html('');
            $('#text').html('');
            $('.nameFriend').append(`${element.firstName} ${element.lastName}`);
            $('#city').append(`${element.city}`);
            $('#phone').append(`${element.phoneNumber}`);
            $('#text').append(`${element.describe}`);
            $('.avatarFriend').append(`<img class="rounded-circle" src="${element.avatar}">`)
        }).catch((err) => console.log(err))
    }
    // open message of friend id
    function openMessage(id){
        $.ajax({
            url: '/v1/info-friend/' + id,
            type: 'GET'
        }).then((data)=> {
            const element = data.data[0];
            $('.userNameMessage').html('');
            $('#avatarReseiver').html('');
            $('.chat-footer').html('');

            ChatosExamle.Message.open(id);
            
            $('#avatarReseiver').append(`<img class="avatar avatar-lg avatarReseiver" src="${element.avatar}">`);
            
            $('.userNameMessage').append(`${element.firstName} ${element.lastName}`);
            
            $('.tinnhan').on('click', function() {
                const id = $(this).attr('id').split('_')[1];
                const message = $('.messageUser').val();
                sendMessages(id, message);
                $('.messageUser').val('');
            });
        }).catch((err) => {
            console.log(err);
        })
    };

    function sendMessages(id, message) {
        let date = new Date();
        try {
            if (message) {
                $.ajax({
                    url: '/v1/messages/' + id,
                    type: 'POST',
                    data: {
                        message: message,
                        date,
                    },
                });
                const data = {
                    message,
                    receiverID: id,
                    date: date.toString().split(' ')[4],
                }
                socket.emit('chat message', data);
                ChatosExamle.Message.add(message, date.toString().split(' ')[4], 'outgoing-message');
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    };

    function allMessages(id) {
        $.ajax({
            url: '/v1/get-message/' + id,
            type: 'GET'
        }).then((data)=> {
            $('.messages').html('');
            data.data.forEach((a)=> {
                time = a.createdAt.split(' ')[4];
                if ( a.receiverID == id ) {
                    ChatosExamle.Message.add(a.messages, time, 'outgoing-message');
                } else {
                    ChatosExamle.Message.add(a.messages, time, '');
                };
            });
        }).catch((error)=> {
            console.log(error);
        });
    };

    $.ajax({
        url: '/v1/user-current-id',
        type: 'GET'
    }).then((data)=> {
        socket.on(`io to client ${data}`, (data) => {
            ChatosExamle.Message.add(data.message, data.date, '');
        });
    })
    // load 
    listYourRequests();
    listThierRequests();
    load();

})

