

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function getUsername() {
            var randomAnimalIndex = Math.floor(getRandomArbitrary(0, animals.length));
            var randomAdjIndex = Math.floor(getRandomArbitrary(0, adjectives.length));
            var name = adjectives[randomAdjIndex] + '.' + animals[randomAnimalIndex];

            return name.replace(/[-_ ]/g, ".").toLowerCase();;
        }


        // Decode utf8 characters properly
        var config = JSON.parse(decodeURIComponent(escape(window.atob('@@config@@'))));
        config.extraParams = config.extraParams || {};
        var connection = config.connection;
        var prompt = config.prompt;
        var languageDictionary;
        var language;

        if (config.dict && config.dict.signin && config.dict.signin.title) {
            languageDictionary = { title: config.dict.signin.title };
        } else if (typeof config.dict === 'string') {
            language = config.dict;
        }
        var loginHint = config.extraParams.login_hint;

        function getParameterByName(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }

        function getLock(prefill, initialScreen) {
          /*languageDictionary.signUpTerms = "<strong>Note:</strong> Email is optional. Feel free to use 'username@crowds-cure.org' instead.<br/><br/>By signing up, you agree to follow the <a href='https://public.cancerimagingarchive.net/ncia/legalRules.jsf' target='_new'>The Cancer Imaging Archive terms of service and data usage policies</a>.";*/
           if (prefill && prefill.username) {
              languageDictionary.signUpTerms = "<strong>Note:</strong> Email is optional. Feel free to use '" + prefill.username + "@crowds-cure.org' instead";
           }
          
            // Available Lock configuration options: https://auth0.com/docs/libraries/lock/v11/configuration
            return new Auth0Lock(config.clientID, config.auth0Domain, {
                auth: {
                    redirectUrl: config.callbackURL,
                    responseType: (config.internalOptions || {}).response_type ||
                        (config.callbackOnLocationHash ? 'token' : 'code'),
                    params: config.internalOptions
                },
                /* additional configuration needed for custom domains */
                configurationBaseUrl: config.clientConfigurationBaseUrl,
                overrides: {
                    __tenant: config.auth0Tenant,
                    __token_issuer: config.authorizationServer.issuer,
                    __jwks_uri: 'https://auth.crowds-cure.org/.well-known/jwks.json'
                },
                assetsUrl: config.assetsUrl,
                allowedConnections: connection ? [connection] : null,
                allowShowPassword: true,
                rememberLastLogin: true,
                allowAutocomplete: true, 
                language: language,
                languageDictionary: languageDictionary,
                theme: {
                    //logo:            'YOUR LOGO HERE',
                    primaryColor: '#2D2C69'
                },
                prefill: prefill,
                closable: false,
                initialScreen: initialScreen,
                defaultADUsernameFromEmailPrefix: false,
                // uncomment if you want small buttons for social providers
                // socialButtonStyle: 'small'
                additionalSignUpFields: [{
                    type: "select",
                    name: "occupation",
                    placeholder: "Profession",
                    options: profession,
                    // The following properties are optional
                    //icon: "https://example.com/assests/location_icon.png",
                    //prefill: "radiologist"
                }, {
                    type: "select",
                    name: "experience",
                    placeholder: "Years of experience",
                    options: [
                        { value: "lessThan5", label: "<5" },
                        { value: "fiveToTen", label: "5-10" },
                        { value: "morethan10", label: ">10" },
                    ],
                }, {
                    type: "select",
                    name: "team",
                    placeholder: "Residency program",
                    options: 
                }, {
                    type: "checkbox",
                    name: "notificationOfDataRelease",
                    prefill: "true",
                    placeholder: "Notify me when the data has been released."
                }]
            });
        }