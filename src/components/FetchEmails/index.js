import { useEffect, useState } from 'react';

const CLIENT_ID = process.env.CLIENT_ID;
const SENDER_EMAIL = 'no-reply@webflow.com';

const FetchedEmails = ({ fetchedEmails, isLoading }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  
  fetchedEmails(emails)
  isLoading(loading)

  useEffect(() => {
    const authenticate = () => {
      const redirectUri = window.location.origin + window.location.pathname;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/gmail.readonly&response_type=token`;

      // Redirect the user to the authentication URL
      window.location.href = authUrl;
    };

    const fetchEmails = async (accessToken) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages?q=from%3A${encodeURIComponent(
            SENDER_EMAIL
          )}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const { messages } = data;

          if (messages && messages.length > 0) {
            const emailPromises = messages.map(async (message) => {
              const messageResponse = await fetch(
                `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              const messageData = await messageResponse.json();
              return messageData;
            });

            const fetchedEmails = await Promise.all(emailPromises);
            setEmails(fetchedEmails);
          } else {
            console.log('No emails found from the specified sender.');
          }
        } else {
          console.log('Failed to fetch emails:', response.statusText);
        }
      } catch (error) {
        console.log('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleAuthentication = () => {
      const queryParams = new URLSearchParams(window.location.hash.substr(1));
      const accessToken = queryParams.get('access_token');

      if (accessToken) {
        fetchEmails(accessToken);
      } else {
        authenticate();
      }
    };

    handleAuthentication();
  }, []);

  return (
    <div>
    </div>
  );
};

export default FetchedEmails;
