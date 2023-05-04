const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_ADDRESS, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD,
        },
    },
    {
        from: `Verifycation <${process.env.EMAIL_ADDRESS}]>`
    }
)

const mailer = (massage) => {
    transporter.sendMail(massage, (err, info) => {
        if(err) return console.log(err)
        console.log(`mail send success`)
    })
}

module.exports = mailer