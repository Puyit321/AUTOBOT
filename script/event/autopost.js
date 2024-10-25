const cron = require('node-cron');
const axios = require('axios');

let chilli = 0;

module.exports.config = {
    name: "autopost-catfact",
    version: "1.0.0",
};

module.exports.handleEvent = async function({ api }) {
    api.setOptions({
        selfListen: false, 
    });
    
    baho(api);
};

function baho(api) {
    cron.schedule("0 */5 * * *", async function () {
        const pogi = Date.now();
        const calamansi = 5 * 60 * 60 * 1000;

        if (pogi - chilli < calamansi) {
            console.log('Post already made in this interval. Skipping...');
            return;
        }

        try {
            const response = await axios.get("https://catfact.ninja/fact");
            const apple = response.data.fact;

            const message = `𝚁𝙰𝙽𝙳𝙾𝙼 𝙲𝙰𝚃 𝙵𝙰𝙲𝚃: “${apple}”`;

            const formData = {
                input: {
                    composer_entry_point: "inline_composer",
                    composer_source_surface: "timeline",
                    idempotence_token: `${Date.now()}_FEED`,
                    source: "WWW",
                    message: {
                        text: message,
                    },
                    audience: {
                        privacy: {
                            base_state: "EVERYONE",
                        },
                    },
                    actor_id: api.getCurrentUserID(),
                },
            };

            const postResult = await api.httpPost(
                "https://www.facebook.com/api/graphql/",
                {
                    av: api.getCurrentUserID(),
                    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
                    fb_api_caller_class: "RelayModern",
                    doc_id: "7711610262190099",
                    variables: JSON.stringify(formData),
                }
            );

            const postID = postResult.data.story_create.story.legacy_story_hideable_id;
            const postLink = `https://www.facebook.com/${api.getCurrentUserID()}/posts/${postID}`;

            api.sendMessage(`[AUTO POST]\nLink: ${postLink}`, /* Specify the thread ID or recipient here */);
            console.log(`[AUTO POST]\nLink: ${postLink}`);

            chilli = pogi;

        } catch (error) {
            console.error("Error during auto-posting:", error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Manila",
    });
              }
