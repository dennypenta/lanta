type Config = {
    port: number,
};

function newConfig(): Config {
    return {
        port: 8000,
    };
}

export default newConfig;
