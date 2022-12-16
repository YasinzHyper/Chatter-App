const mockMessages = [
    {
        createdBy: "Yasin",
        createdOn: new Date('December 05, 2020 18:30:00'),
        channel: "Friends",
        own: true,
        text: "So, we meet-up tomorrow at Shishir's place. Everyone be there by 8 in the morning.",
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1;
        } 
    },
    {
        createdBy: "Mokshith",
        createdOn: new Date('December 05, 2020 18:35:00'),
        channel: "Friends",
        own: false,
        text: "Yeah I'll be there by 7, let me know if you need me to get anything",
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1;
        } 
    },
    {
        createdBy: "Yasin",
        createdOn: new Date('December 05, 2020 18:40:00'),
        channel: "Friends",
        own: false,
        text: "Nothing as such, just come it's alright. Call up Vedant and check once if he's coming.",
        yesterdayOrOlder() {
            return new Date().getDate() - this.createdOn.getDate() > 1;
        } 
    }
]