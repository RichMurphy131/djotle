import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "eu-north-1" });

/**
 * Fetch multiple secrets from AWS Secrets Manager.
 * @param {string[]} secretNames - Array of secret names to fetch.
 * @returns {Promise<Object>} - An object containing secret key-value pairs.
 */
export async function getSecrets(secretNames) {
    const secrets = {};

    try {
        const secretPromises = secretNames.map(async (secretName) => {
            const command = new GetSecretValueCommand({ SecretId: secretName });
            const response = await client.send(command);

            if (response.SecretString) {
                secrets[secretName] = JSON.parse(response.SecretString);
            }
        });

        await Promise.all(secretPromises);
        return secrets;

    } catch (error) {
        console.error("Error fetching secrets:", error);
        throw error;
    }
}