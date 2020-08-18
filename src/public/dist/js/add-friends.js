$(document).ready(function(){
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
                let li = $(`<li class="list-group-item" id="li${element.firendId}">
                                <div>
                                    <figure class="avatar">
                                        <img class="rounded-circle" src="${element.avatar}">
                                    </figure>
                                </div>
                                <div class="users-list-body">
                                    <h5>${element.firstName} ${element.lastName}</h5>
                                    <p>${element.message}</p>
                                    <div class="users-list-action action-toggle">
                                        <div class="dropdown">
                                            <a data-toggle="dropdown" href="#">
                                                <i class="ti-more"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right"  id="${element.firendId}">
                                                <a class="dropdown-item active profile" data-navigation-target='contact-information'>
                                                    Profile
                                                </a>
                                                <a class="dropdown-item notAccept">
                                                    Delete
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>`);
                $('#requestsAcceptForYou').append(li);
                $('.notAccept').on('click', function (){
                    NotAcceptFriends($(this).parent().attr('id'));
                    $('#li' + $(this).parent().attr('id')).hide();
                })
                $('.profile').on('click', function (){
                    profileFriend($(this).parent().attr('id'));
                })
            }
        })
        .catch((error) => {
            console.log(error)
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
                let li = $(`<li class="list-group-item" id="li_${element.userId}">
                                <div>
                                    <figure class="avatar">
                                        <img class="rounded-circle" src="${element.avatar}">
                                    </figure>
                                </div>
                                <div class="users-list-body">
                                    <h5>${element.firstName} ${element.lastName}</h5>
                                    <p>${element.message}</p>
                                    <div class="users-list-action action-toggle">
                                        <div class="dropdown">
                                            <a data-toggle="dropdown" href="#">
                                                <i class="ti-more"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right"  id="friendId_${element.userId}">
                                                <a class="dropdown-item accept">
                                                    Accept
                                                </a>
                                                <a class="dropdown-item active profileFriends" data-navigation-target='contact-information'>
                                                    Profile
                                                </a>
                                                <a class="dropdown-item delete">
                                                    Delete
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>`);
                $('#acceptedFriends').append(li);
                $('.accept').on('click', function(){
                    const id = $(this).parent().attr('id').split('_')[1];
                    $('#li_'+ id).hide();
                    update(id);
                    load();
                })
                $('.delete').on('click', function(){
                    const id = $(this).parent().attr('id').split('_')[1];
                    NotAcceptFriends(id, 1);
                    $('#li_' + id).hide();
                })
                $('.profileFriends').on('click', function(){
                    profileFriend($(this).parent().attr('id').split('_')[1]);
                })
            }
        })
        .catch((error) => {
            console.log(error)
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
            for( i=0; i<data.length; i++) {
                let y;
                let element = data[i];
                console.log(data[i].avatar)
                if(!element.userId) {
                    y = element.firendId
                } else {
                    y = element.userId
                }
                let li = $(`<li class="list-group-item" id="li__${y}">
                                <div>
                                    <figure class="avatar">
                                        <img class="rounded-circle" src="${element.avatar}">
                                    </figure>
                                </div>
                                <div class="users-list-body">
                                    <h5>${element.firstName} ${element.lastName}</h5>
                                    <p>${element.message}</p>
                                    <div class="users-list-action action-toggle">
                                        <div class="dropdown">
                                            <a data-toggle="dropdown" href="#">
                                                <i class="ti-more"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right"  id="${y}">
                                                <a class="dropdown-item openMessage"> Open </a>
                                                <a class="dropdown-item active info" data-navigation-target='contact-information'> Profile </a>
                                                <a class="dropdown-item"> Add to archive</a>
                                                <a class="dropdown-item cancelFriends"> Delete </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>`);
                $('#listAllFriends').append(li);
                $('.cancelFriends').on('click', function() {
                    const id = $(this).parent().attr('id');
                    NotAcceptFriends(id , 2);
                    $('#li__' + id).hide();
                })
                $('.info').on('click', function() {
                    profileFriend($(this).parent().attr('id'));
                })
                $('.openMessage').on('click', function() {
                    openMessage($(this).parent().attr('id'));
                })
            }
        })
    }
    // load 
    listYourRequests();
    listThierRequests();
    load();
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
    function NotAcceptFriends(id, status) {
        $.ajax({
            url: '/v1/not-accept-friend/' + id,
            method: 'DELETE',
            data: {
                status
            }
        }).then((data)=> {
            console.log(data);
        }).catch((error)=> {
            console.log(error);
        })
    }
    // profile friends findById
    function profileFriend(id) {
        $.ajax({
            url: '/v1/info-friend/' + id,
            method: 'GET'
        }).then((data)=> {
            $('.avatarFriend').html('');
            $('.nameFriend').html('');
            $('#phone').html('');
            $('#city').html('');
            $('#text').html('');
            $('.nameFriend').append(`${data.data[0].firstName} ${data.data[0].lastName}`);
            $('#city').append(`${data.data[0].city}`);
            $('#phone').append(`${data.data[0].phoneNumber}`);
            $('#text').append(`${data.data[0].describe}`);
            $('.avatarFriend').append(`<img class="rounded-circle" src="${data.data[0].avatar}">`)
        }).catch((err) => console.log(err))
    }
    // open message of friend id
    function openMessage(id){
        $.ajax({
            url: '/v1/info-friend/' + id,
            type: 'GET'
        }).then((data)=> {
            $('.userNameMessage').html('');
            $('#avatarReseiver').html('');
            $('.chat-footer').html('');
            $('.chat-footer').append(`
            <form action="">
                <input class="form-control messageUser" name="message" type="text" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                <div class="form-buttons">
                    <button class="btn btn-light btn-floating" type="button"><i class="fa fa-paperclip"></i></button>
                    <button class="btn btn-light btn-floating" type="button"><i class="fa fa-microphone"></i></button>
                    <button class="btn btn-primary btn-floating tinnhan" id="sendMessages_${id}" type="submit"><i class="fa fa-send"></i></button>
                </div>
            </form>`);
            $('#avatarReseiver').append(`<img class="avatar avatar-lg avatarReseiver" src="${data.data[0].avatar}">`);
            $('.userNameMessage').append(`${data.data[0].firstName} ${data.data[0].lastName}`);
            $('.tinnhan').on('click', function() {
                const id = $(this).attr('id').split('_')[1];
                sendMessages(id);
            })
        }).catch((err) => {
            console.log(err);
        })
    };

    // $('.send').attr('id');
    function sendMessages(id) {
        const message = $('.messageUser').val();
        console.log(message);
        console.log(id);
        if (message) {
            $.ajax({
                url: '/v1/messages/' + id,
                type: 'POST',
                data: {
                    message: message,
                },
            }).then((data) => {
                console.log(data);
            }).catch((err)=> {
                console.log(err);
            });
        }
    };
})

