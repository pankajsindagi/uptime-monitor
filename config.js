/*
 * Create and export configuration variables
 *
 */

// Container for all the environments

let environments = {};

// Staging {default} environment
environments.staging = {
    'port': 5000,
    'envName': 'Staging'
};

// Production environment
environments.production = {
    'port': 3000,
    'envName': 'Production'
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if not, default to staging.
let environmentToExport = typeof (currentEnvironment) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;