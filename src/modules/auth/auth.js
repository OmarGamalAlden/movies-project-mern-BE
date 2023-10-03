import userModel from "../../../DB/models/user.model.js";
import { Compareing, Hashing } from "../../utils/Hash&compare.js";
import { GlobalError } from "../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../utils/generate&verifyToken.js";
import sendEmail from "../../utils/senEmail.js";

export const signUp = async (req, res, next) => {
  const { userName, password, email, cPassword, age, role } = req.body;
  if (password != cPassword) {
    return next(
      new GlobalError({ message: "password dosen't match", statusCode: 403 })
    );
  }
  if (await userModel.findOne({ email })) {
    return next(
      new GlobalError({
        message: "Email is already exist, Please sigin",
        statusCode: 409,
      })
    );
  }
  //sending token with link to user for confirm email
  const token = generateToken({ payLoad: { email }, expiresIn: 60 * 10 });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  //if user asked a new confirm email...
  const refreshToken = generateToken({
    payLoad: { email },
    expiresIn: 60 * 60 * 24 * 30,
  });
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`;

  const html = `<!DOCTYPE html>
  <html>
  
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <style type="text/css">
      body {
          background-color: #88BDBF;
          margin: 0px;
      }
  </style>
  
  <body style="margin:0px;">
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
          <tr>
              <td>
                  <table border="0" width="100%">
                      <tr>
                          <td>
                              <h1>
                                  <img width="100px"
                                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
                              </h1>
                          </td>
                          <td>
                              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                      style="text-decoration: none;">View In Website</a></p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" cellpadding="0" cellspacing="0"
                      style="text-align:center;width:100%;background-color: #fff;">
                      <tr>
                          <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                              <img width="50px" height="50px"
                                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p style="padding:0px 100px;">
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <a href="${link}"
                                  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify
                                  Email address</a>
                          </td>
                      </tr>
                      <br>
                      <br>
                      <br>
                      <tr>
                          <td>
                              <a href="${refreshLink}"
                                  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                      <tr>
                          <td>
                              <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="margin-top:20px;">
  
                                  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                              width="50px" hight="50px"></span></a>
  
                                  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                                  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                              </div>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;

  const checkEmail = await sendEmail({
    to: email,
    html,
    subject: "Confirm Email",
  });
  if (!checkEmail) {
    new GlobalError({ message: "email is incorrect", statusCode: 400 });
  }

  const hashPassword = Hashing({ text: password });
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    age,
    role,
    confirmEmail: false,
  });
  return res.status(201).json({
    message:
      "Your signup is successfully, please confirm your email before logIn..",
    id: user._id,
  });
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
  const user = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true },
    { new: true }
  );
  if (user) {
    return res.status(200).send("<P>Email confirmation successfully</P>");
  }
};

export const newConfirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });

  const newToken = generateToken({ payLoad: { email }, expiresIn: 60 * 3 });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;

  const html = `<!DOCTYPE html>
    <html>
    
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <style type="text/css">
        body {
            background-color: #88BDBF;
            margin: 0px;
        }
    </style>
    
    <body style="margin:0px;">
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
            <tr>
                <td>
                    <table border="0" width="100%">
                        <tr>
                            <td>
                                <h1>
                                    <img width="100px"
                                        src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
                                </h1>
                            </td>
                            <td>
                                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                        style="text-decoration: none;">View In Website</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="0" cellpadding="0" cellspacing="0"
                        style="text-align:center;width:100%;background-color: #fff;">
                        <tr>
                            <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                                <img width="50px" height="50px"
                                    src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding:0px 100px;">
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="${link}"
                                    style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify
                                    Email address</a>
                            </td>
                        </tr>
                        <br>
                        <br>
                        <br>
                        <tr>
                            <td>
                                <a href="${refreshLink}"
                                    style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                        <tr>
                            <td>
                                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="margin-top:20px;">
    
                                    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                                width="50px" hight="50px"></span></a>
    
                                    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                                width="50px" hight="50px"></span>
                                    </a>
    
                                    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                                width="50px" hight="50px"></span>
                                    </a>
    
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`;

  const checkEmail = await sendEmail({
    to: email,
    html,
    subject: "Confirm Email",
  });
  if (!checkEmail) {
    new GlobalError({ message: "email is incorrect", statusCode: 400 });
  }
  return res.status(200).send("<p>Done.. please,check your email inbox</p>");
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return next(
      new GlobalError({
        message: "Not register account, Please signup..",
        statusCode: 400,
      })
    );
  }
  if (checkUser.confirmEmail == false) {
    return next(
      new GlobalError({
        message: "You must confirm your mail first before signin!!",
        statusCode: 401,
      })
    );
  }
  const matchPassword = Compareing({
    hashedValue: checkUser.password,
    text: password,
  });
  if (!matchPassword) {
    return next(
      new GlobalError({
        message: "incorrect password, Please try again",
        statusCode: 400,
      })
    );
  }
  const token = generateToken({
    payLoad: {
      id: checkUser._id,
      userName: checkUser.userName,
      email: checkUser.email,
      age: checkUser.age,
      isLOggedIn: true,
    },
  });
  return res
    .status(200)
    .json({ message: "Your signIn is successfully", token });
};
