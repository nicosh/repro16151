module.exports = ({ env }) => ({
  placeholder: {
    enabled: true,
    config: {
      size: 10,
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "**@******.it",
      },
    },
  },
  "config-sync": {
    enabled: true,
    config: {
      excludedConfig: [
        "core-store.plugin_users-permissions_grant",
        "core-store.plugin_upload_metrics",
        "core-store.strapi_content_types_schema",
        "core-store.ee_information",
        "core-store.core_admin_project-settings",
        "core-store.plugin_users-permissions_advanced",
      ],
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("S3KEYID"),
        secretAccessKey: env("S3SECRET"),
        region: "eu-west-3",
        params: {
          Bucket: "*****",
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // ...
});
