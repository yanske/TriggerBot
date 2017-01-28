var bot = new cleverbot('kyZYjP2JiUwC20IJ','bTCuN7rZLroqzrH9q1PfauT2eiYVJhkZ');
var inputString = "lol!";

bot.setNick("Response");

bot.create(function (err, session) {
});

function ask (string) {
    bot.ask(string, function (err, response) {
            console.log(response);     });
}

window.onload = function () {
    ask(inputString);
};


