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
    return false;
  } catch (error) {
    throw new Error(error.response.data.detail);
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
      'status': 'subscribed',
      'merge_fields': {
        'FNAME': firstName
      }
    };
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}/3.0/lists/${listId}/members`,
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

async function sendWelcomeEmail(apiUrl, apiKey, email, senderEmail, senderName, templateId) {
  try {
    console.log(`[sendWelcomeEmail] Sending welcome email to user ${email}`);
    const data = {
      from: {
        email: senderEmail,
        name: senderName
      },
      reply_to: {
        email: senderEmail
      },
      personalizations: [{
        to: [{
          email: email
        }]
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
      throw new Error(`There was an error trying send a welcome email to ${email}.`);
    }
  } catch (error) {
    throw new Error(error.response.data.errors[0].message);
  }
}

async function sendCompanyEmail(apiUrl, apiKey, email, senderEmail,
                                senderName, senderMessage, templateId) {
  try {
    console.log(`[sendCompanyEmail] Sending message from ${senderEmail} to company list`);
    const data = {
      from: {
        email: senderEmail,
        name: senderName
      },
      reply_to: {
        email: senderEmail
      },
      personalizations: [{
        to: [{
          email: email
        }],
        subject: 'New message on collagelabs.org Contact Form',
        dynamic_template_data: {
          content: senderMessage
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

exports.handler = async (event) => {
  let body = {}, serverErrorMessage;
  let headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  };
  const {
    SENDGRID_API_KEY,
    SENDGRID_WELCOME_SENDER_EMAIL,
    SENDGRID_WELCOME_SENDER_NAME,
    SENDGRID_WELCOME_TEMPLATE_ID,
    SENDGRID_COMPANY_EMAIL,
    SENDGRID_COMPANY_TEMPLATE_ID,
    SENDGRID_API_BASE_URL,
    SENDGRID_LIST_ID,
    MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID,
    MAILCHIMP_API_BASE_URL,
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SPREADSHEET_ID,
    GOOGLE_SPREADSHEET_NAME,
  } = process.env;

  try {
    body = JSON.parse(event.body)
  } catch (e) {
    body = querystring.parse(event.body)
  }

  if (!(body.email && body.name && body.message)) {
    serverErrorMessage = 'Error receiving request: missing email, name or message.';
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
        SENDGRID_COMPANY_EMAIL && SENDGRID_COMPANY_TEMPLATE_ID &&
        SENDGRID_API_BASE_URL && SENDGRID_LIST_ID && MAILCHIMP_API_KEY &&
        MAILCHIMP_LIST_ID && MAILCHIMP_API_BASE_URL && GOOGLE_CLIENT_EMAIL &&
        GOOGLE_PRIVATE_KEY && GOOGLE_SPREADSHEET_ID && GOOGLE_SPREADSHEET_NAME)) {
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

  const isUserOnSendgridList = await checkUserOnSendgridList(
    SENDGRID_API_BASE_URL,
    SENDGRID_API_KEY,
    SENDGRID_LIST_ID,
    body.email).catch((error) => {
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
    body.email).catch((error) => {
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
      body.email,
      body.name).catch((error) => {
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
      body.email,
      body.name).catch((error) => {
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
      body.email,
      SENDGRID_WELCOME_SENDER_EMAIL,
      SENDGRID_WELCOME_SENDER_NAME,
      SENDGRID_WELCOME_TEMPLATE_ID).catch((error) => {
        serverErrorMessage = 'Error in server operation: external service communication problem.';
        console.error(serverErrorMessage);
        console.error('[sendUserWelcomeEmail] There was an error communicating with Sendgrid API.');
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
    SENDGRID_COMPANY_EMAIL,
    body.email,
    body.name,
    body.message,
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
    body.email,
    body.name,
    body.message).catch((error) => {
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