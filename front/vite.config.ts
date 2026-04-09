import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

export default defineConfig(({mode}) => {

    const env = loadEnv(mode, process.cwd(), '')

    return {

        plugins: [react()],
        build: {
            chunkSizeWarningLimit: 2600,
            sourcemap : true
        },
        // vite config
        define: {
            SSC_HOME: JSON.stringify(env.VITE_APP_ENV),
            isDev : mode === "development"
        },
        resolve : {
            alias:{
                // "@" : "/src"
                "@" : path.resolve(__dirname, "src")
            }
        },
        base: mode === "development" ? "/ssc/" : "/ssc/static/"
        // base: "/ssc/"
    }
})
