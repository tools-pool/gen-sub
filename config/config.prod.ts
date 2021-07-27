import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
    const config: PowerPartial<EggAppConfig> = {};

    config.redis = {
        client: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT!,
            password: process.env.REDIS_PASSWORD,
            db: +process.env.REDIS_DB!,
        },
    };

    return config;
};
