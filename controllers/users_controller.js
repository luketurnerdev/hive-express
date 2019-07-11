function create() {
    //Create a new user when they sign up
    //Most of this information will be pulled from the Meetup API

    //We may need to insert checks to determine if the user already exists in the DB or not.
}

async function create(req, res) {
    const { title, url } = req.body;
    req.user.bookmarks.push({ title, url });
    await req.user.save();
    res.json(req.user.bookmarks);
}