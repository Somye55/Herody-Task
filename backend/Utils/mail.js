const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 587,
        secure: false,
        auth: {
          user: 'origincloud@gmail.com',
          pass: 'origincloud',
        },
      });
  
      await transporter.sendMail({
        from: 'origincloud@gmail.com',
        to: '',
        subject: subject,
        text: text,
      });
      console.log("email sent sucessfully");
    } catch (error) {
      console.log("email not sent");
      console.log(error);
    }
  };
  
  module.exports = sendEmail;