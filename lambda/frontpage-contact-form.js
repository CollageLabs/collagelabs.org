const { google } = require('googleapis');
const querystring = require('querystring');
const axios = require('axios');
var crypto = require('crypto');

require('dotenv').config();


async function checkUserOnSendgridList (apiUrl, apiKey, listId, email) {
  try {
    console.log(`[checkUserOnSendgridList] Verifying if user ${email} is in list ${listId}`);
    const data = {
      query: `email LIKE \'${email}%\' AND CONTAINS(list_ids, \'${listId}\')`
    };
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}/v3/marketing/contacts/search`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: data
    });
    if (response.data.contact_count == 0) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(error.response.data.errors[0].message);
  }
}

async function checkUserOnMailchimpList (apiUrl, apiKey, listId, email) {
  try {
    console.log(`[checkUserOnMailchimpList] Verifying if user ${email} is in list ${listId}`);
    const emailHash = crypto.createHash('md5').update(email).digest("hex");
    try {
      const response = await axios({
        method: 'GET',
        url: `${apiUrl}/3.0/lists/${listId}/members/${emailHash}`,
        auth: {
          username: 'apikey',
          password: apiKey
        }
      });
      if (response.data.email_address == email && response.data.status == 'subscribed') {
        return true;
      }
    } catch (error) {
      if (error.response.data.status == 404) {
        return false;
      }
      throw new Error(error.response.data.detail);
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

async function addUserSendgrid (apiUrl, apiKey, listId, email, firstName) {
  try {
    console.log(`[addUserSendgrid] Adding user ${email} to list ${listId}`);
    const data = {
      list_ids: [
        listId
      ],
      contacts: [{
        email: email,
        first_name: firstName
      }]
    };
    const response = await axios({
      method: 'PUT',
      url: `${apiUrl}/v3/marketing/contacts`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: data
    });
    if (response.status != 202) {
      throw new Error(`There was an error trying to add your user ${email}.`);
    }
  } catch (error) {
    throw new Error(error.response.data.errors[0].message);
  }
}

async function addUserMailchimp (apiUrl, apiKey, listId, email, firstName) {
  try {
    console.log(`[addUserMailchimp] Adding user ${email} to list ${listId}`);
    const data = {
      'email_address': email,
      'status': 'subscribed'
    };
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}/3.0/lists/${listId}/members?skip_merge_validation=true`,
      auth: {
        username: 'apikey',
        password: apiKey
      },
      data: data
    });
    if (response.status != 200) {
      throw new Error(`There was an error trying to add your user ${email}.`);
    }
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
}

async function sendWelcomeEmail(apiUrl, apiKey, toEmail, toName,
                                senderEmail, senderName, templateId) {
  try {
    console.log(`[sendWelcomeEmail] Sending welcome email to user ${toEmail}`);
    const data = {
      from: {
        email: senderEmail,
        name: senderName
      },
      reply_to: {
        email: senderEmail,
        name: senderName
      },
      to: [{
        email: toEmail,
        name: toName
      }],
      subject: "Welcome to Collage Labs",
      personalizations: [{
        to: [{
          email: toEmail,
          name: toName
        }],
        subject: "Welcome to Collage Labs",
        dynamic_template_data: {
          subject: "Welcome to Collage Labs",
          toEmail: toEmail,
          toName: toName
        },
      }],
      template_id: templateId
    };
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}/v3/mail/send`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: data
    });
    if (response.status != 202) {
      throw new Error(`There was an error trying send a welcome email to ${toEmail}.`);
    }
  } catch (error) {
    throw new Error(error.response.data.errors[0].message);
  }
}

async function sendCompanyEmail(apiUrl, apiKey, toEmail, replyToEmail, replyToName,
                                senderEmail, senderName, senderMessage,
                                templateId) {
  try {
    console.log(`[sendCompanyEmail] Sending message from ${senderEmail} to company list`);
    const data = {
      from: {
        email: senderEmail,
        name: senderName
      },
      reply_to: {
        email: replyToEmail,
        name: replyToName
      },
      to: [{
        email: toEmail,
        name: 'Contact'
      }],
      subject: 'New message on collagelabs.org Contact Form',
      personalizations: [{
        to: [{
          email: toEmail,
          name: 'Contact'
        }],
        subject: 'New message on collagelabs.org Contact Form',
        dynamic_template_data: {
          subject: 'New message on collagelabs.org Contact Form',
          senderEmail: replyToEmail,
          senderName: replyToName,
          senderMessage: senderMessage
        },
      }],
      template_id: templateId
    };
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}/v3/mail/send`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: data
    });
    if (response.status != 202) {
      throw new Error(`There was an error trying send a company email from ${senderEmail}.`);
    }
  } catch (error) {
    throw new Error(error.response.data.errors[0].message);
  }
}

const getGoogleClient = async (clientEmail, privateKey) => {
  try {
    return await google.auth.getClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
  } catch (error) {
    throw new Error(error);
  }
}

const authorizeSheets = async (clientEmail, privateKey) => {
  try {
    const client = await getGoogleClient(clientEmail, privateKey);
    return await google.sheets({
      version: 'v4',
      auth: client,
    });
  } catch (error) {
    throw new Error(error);
  }
}

const addSpreadsheetRow = async (clientEmail, privateKey, sheetId, sheetName, email, name, message) => {
  try {
    console.log(`[addSpreadsheetRow] Logging message from ${email} on google spreadsheets`);
    const range = `${sheetName}!A3`;
    const date = new Date();
    const sheets = await authorizeSheets(clientEmail, privateKey)
    return await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[email, name, message, date]],
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function checkRecaptchaState(recaptchaApiSecret, recaptchaState) {
  try {

    console.log(`[checkRecaptchaState] Validating recaptcha state`);
    const response = await axios({
      method: 'POST',
      url: `https://www.google.com/recaptcha/api/siteverify?response=${recaptchaState}&secret=${recaptchaApiSecret}`
    });
    if (response.status != 200) {
      throw new Error(`There was an error trying to validate captcha.`);
    }
    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

exports.handler = async (event) => {
  let serverErrorMessage;
  const headers = {
    'Content-Type': 'application/json',
  };
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n');
  const {
    SENDGRID_API_KEY,
    SENDGRID_WELCOME_SENDER_EMAIL,
    SENDGRID_WELCOME_SENDER_NAME,
    SENDGRID_WELCOME_TEMPLATE_ID,
    SENDGRID_COMPANY_LIST_EMAIL,
    SENDGRID_COMPANY_SENDER_EMAIL,
    SENDGRID_COMPANY_SENDER_NAME,
    SENDGRID_COMPANY_TEMPLATE_ID,
    SENDGRID_API_BASE_URL,
    SENDGRID_LIST_ID,
    MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID,
    MAILCHIMP_API_BASE_URL,
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_SPREADSHEET_ID,
    GOOGLE_SPREADSHEET_NAME,
    RECAPTCHA_API_SECRET
  } = process.env;
  const {
    'contact-email': CONTACT_EMAIL,
    'contact-name': CONTACT_NAME,
    'contact-message': CONTACT_MESSAGE,
    'recaptcha-state': RECAPTCHA_STATE
  } = querystring.parse(event.body);

  if (event.headers.host == 'localhost:9000') {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  }

  if (!(CONTACT_EMAIL && CONTACT_NAME && CONTACT_MESSAGE && RECAPTCHA_STATE)) {
    serverErrorMessage = 'Error receiving request: missing email, name, message or recaptcha state.';
    console.error(serverErrorMessage)
    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify({
        result: 'error',
        msg: serverErrorMessage
      })
    };
  }

  if (!(SENDGRID_API_KEY && SENDGRID_WELCOME_SENDER_EMAIL &&
        SENDGRID_WELCOME_SENDER_NAME && SENDGRID_WELCOME_TEMPLATE_ID &&
        SENDGRID_COMPANY_LIST_EMAIL && SENDGRID_COMPANY_SENDER_EMAIL &&
        SENDGRID_COMPANY_SENDER_NAME && SENDGRID_COMPANY_TEMPLATE_ID &&
        SENDGRID_API_BASE_URL && SENDGRID_LIST_ID && MAILCHIMP_API_KEY &&
        MAILCHIMP_LIST_ID && MAILCHIMP_API_BASE_URL && GOOGLE_CLIENT_EMAIL &&
        GOOGLE_PRIVATE_KEY && GOOGLE_SPREADSHEET_ID &&
        GOOGLE_SPREADSHEET_NAME && RECAPTCHA_API_SECRET)) {
    serverErrorMessage = 'Error in server configuration: one or more secret keys missing.';
    console.error(serverErrorMessage)
    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify({
        result: 'error',
        msg: serverErrorMessage
      })
    };
  }

  const isHuman = await checkRecaptchaState(
    RECAPTCHA_API_SECRET,
    RECAPTCHA_STATE).catch((error) => {
      recaptchaErrorMessage = 'Error validating captcha: an error ocurred.';
      console.error(recaptchaErrorMessage);
      console.error('[checkRecaptchaState] There was an error validating the captcha state.');
      console.error(error);
      return {
        headers: headers,
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          msg: recaptchaErrorMessage
        })
      };
    });

  if (!isHuman) {
    return {
      headers: headers,
      statusCode: 400,
      body: JSON.stringify({
        result: 'error',
        msg: 'Error validating captcha: captcha state is invalid.'
      })
    };
  }

  const isUserOnSendgridList = await checkUserOnSendgridList(
    SENDGRID_API_BASE_URL,
    SENDGRID_API_KEY,
    SENDGRID_LIST_ID,
    CONTACT_EMAIL).catch((error) => {
      serverErrorMessage = 'Error in server operation: external service communication problem.';
      console.error(serverErrorMessage);
      console.error('[checkUserOnSendgridList] There was an error communicating with Sendgrid API.');
      console.error(error);
      return {
        headers: headers,
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          msg: serverErrorMessage
        })
      };
    });

  const isUserOnMailchimpList = await checkUserOnMailchimpList(
    MAILCHIMP_API_BASE_URL,
    MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID,
    CONTACT_EMAIL).catch((error) => {
      serverErrorMessage = 'Error in server operation: external service communication problem.';
      console.error(serverErrorMessage);
      console.error('[checkUserOnMailchimpList] There was an error communicating with Mailchimp API.');
      console.error(error);
      return {
        headers: headers,
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          msg: serverErrorMessage
        })
      };
    });

  if (!isUserOnSendgridList) {
    await addUserSendgrid(
      SENDGRID_API_BASE_URL,
      SENDGRID_API_KEY,
      SENDGRID_LIST_ID,
      CONTACT_EMAIL,
      CONTACT_NAME).catch((error) => {
        serverErrorMessage = 'Error in server operation: external service communication problem.';
        console.error(serverErrorMessage);
        console.error('[addUserSendgrid] There was an error communicating with Sendgrid API.');
        console.error(error);
        return {
          headers: headers,
          statusCode: 400,
          body: JSON.stringify({
            result: 'error',
            msg: serverErrorMessage
          })
        };
      });
  }

  if (!isUserOnMailchimpList) {
    await addUserMailchimp(
      MAILCHIMP_API_BASE_URL,
      MAILCHIMP_API_KEY,
      MAILCHIMP_LIST_ID,
      CONTACT_EMAIL,
      CONTACT_NAME).catch((error) => {
        serverErrorMessage = 'Error in server operation: external service communication problem.';
        console.error(serverErrorMessage);
        console.error('[addUserMailchimp] There was an error communicating with Mailchimp API.');
        console.error(error);
        return {
          headers: headers,
          statusCode: 400,
          body: JSON.stringify({
            result: 'error',
            msg: serverErrorMessage
          })
        };
      });
  }

  if (!isUserOnSendgridList && !isUserOnMailchimpList) {
    await sendWelcomeEmail(
      SENDGRID_API_BASE_URL,
      SENDGRID_API_KEY,
      CONTACT_EMAIL,
      CONTACT_NAME,
      SENDGRID_WELCOME_SENDER_EMAIL,
      SENDGRID_WELCOME_SENDER_NAME,
      SENDGRID_WELCOME_TEMPLATE_ID).catch((error) => {
        serverErrorMessage = 'Error in server operation: external service communication problem.';
        console.error(serverErrorMessage);
        console.error('[sendWelcomeEmail] There was an error communicating with Sendgrid API.');
        console.error(error);
        return {
          headers: headers,
          statusCode: 400,
          body: JSON.stringify({
            result: 'error',
            msg: serverErrorMessage
          })
        };
      });
  }

  await sendCompanyEmail(
    SENDGRID_API_BASE_URL,
    SENDGRID_API_KEY,
    SENDGRID_COMPANY_LIST_EMAIL,
    CONTACT_EMAIL,
    CONTACT_NAME,
    SENDGRID_COMPANY_SENDER_EMAIL,
    SENDGRID_COMPANY_SENDER_NAME,
    CONTACT_MESSAGE,
    SENDGRID_COMPANY_TEMPLATE_ID).catch((error) => {
      serverErrorMessage = 'Error in server operation: external service communication problem.';
      console.error(serverErrorMessage);
      console.error('[sendCompanyEmail] There was an error communicating with Sendgrid API.');
      console.error(error);
      return {
        headers: headers,
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          msg: serverErrorMessage
        })
      };
    });

  await addSpreadsheetRow(
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SPREADSHEET_ID,
    GOOGLE_SPREADSHEET_NAME,
    CONTACT_EMAIL,
    CONTACT_NAME,
    CONTACT_MESSAGE).catch((error) => {
      serverErrorMessage = 'Error in server operation: external service communication problem.';
      console.error(serverErrorMessage);
      console.error('[addSpreadsheetRow] There was an error communicating with Google Cloud API.');
      console.error(error);
      return {
        headers: headers,
        statusCode: 400,
        body: JSON.stringify({
          result: 'error',
          msg: serverErrorMessage
        })
      };
    });

  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify({
      result: 'success',
      msg: 'Your message was sent successfully! We\'ll be getting back to you shortly.'
    })
  };

};