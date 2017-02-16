// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/* global jasmine */
const SpecReporter = require('jasmine-spec-reporter');

const config = {};

const argv = require('yargs')
	.wrap(null)
	.usage('Angular Lab E2E test options. Usage: $0 --browsers CHROME_DESKTOP')
	.options({
		browsers: {
			describe: 'Comma separated list of preconfigured browsers to use.',
			default: 'CHROME_DESKTOP',
			type: 'string'
		}
	})
	.help('help')
	.argv;

const capabilities = {
	CHROME_DESKTOP: {
		browserName: 'chrome',
		chromeOptions: {
			'args': ['--js-flags=--expose-gc'],
			'perfLoggingPrefs': {
				'traceCategories': 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline'
			}
		},
		loggingPrefs: {
			performance: 'ALL',
			browser: 'ALL'
		}
	}
};


// On Travis we use Saucelabs browsers.
if (process.env.TRAVIS) {
	Object.keys(capabilities)
		.forEach((key) => {
			capabilities[key].build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
			capabilities[key]['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
			capabilities[key].name = 'E2E - Angular Lab';
		});

	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}


exports.config = Object.assign(config, {
	allScriptsTimeout: 11000,
	specs: [
		'./e2e/**/*.e2e-spec.ts'
	],
	multiCapabilities: argv.browsers
		.split(',')
		.map((browser) => {
			const caps = capabilities[browser];
			console.log(`Testing against: ${browser}`);

			if (!caps) {
				throw new Error(`There is no browser with name "${browser};" configured.`);
			}
		return caps;
	}),
	directConnect: true,
	baseUrl: `http://localhost:4200/`,
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print: function () {} // Remove protractor dot reporter
	},
	// Special option for Angular2, to test against all Angular2 applications on the page.
	// This means that Protractor will wait for every app to be stable before each action, and search within all apps when finding elements.
	useAllAngular2AppRoots: true,
	onPrepare: function () {
		// Add jasmine spec reporter
		jasmine.getEnv()
			.addReporter(new SpecReporter({displayStacktrace: 'all'}));
		// Include jasmine expect
		require('jasmine-expect');
	},
	beforeLaunch: function () {
		require('ts-node')
			.register({
				project: 'e2e'
			});
	},
	plugins: [
		{
			package: 'protractor-accessibility-plugin',
			chromeA11YDevTools: {
				treatWarningsAsFailures: false
			}
		},
		{
			package: 'protractor-console-plugin',
			failOnWarning: false,
			failOnError: true,
			logWarnings: false,
			exclude: [
				'info'
			]
		}
	]
});