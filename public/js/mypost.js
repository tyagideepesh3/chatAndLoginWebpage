
function loadPost(){
    $.get('/api/allposts', (posts) => {
        console.log(posts)
        for (p of posts) {
            // console.log(p.id)
            // console.log(p.title)
            // console.log(p.body)
            $('#postContainer').append(
                $(`
                    your post no ${p.id} has title ${p.title}
                `)
            )
            console.log(p.id)
            console.log(p.title)
            console.log(p.body)
        }
    })
}
// console.log("hi")