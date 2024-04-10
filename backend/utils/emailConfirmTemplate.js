const confirmEmail = (link) => {
    return `
<div style="font-family: Arial, sans-serif; background-color: #f7f7f7; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="background-color: #fff; margin:auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; width: 65%;">
        <h1 style="margin-bottom: 20px;">Welcome to our platform!</h1>
        <p>Your account has been successfully created. Below you can verify your email.</p>
        <p>To verify your email, click on the following link:</p>
        <a style="background-color: orange; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 16px; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; transition: background-color 0.3s;" href="${link}">Verify Email</a>
    </div>
</div>

    `;
};

module.exports = { confirmEmail };
