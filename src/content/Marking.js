import { useEffect } from "react";

function Marking() {
    const registerPlugin = () => {
        window.dispatchEvent(
            new CustomEvent('service-plugin-dock-event', {
                detail: {
                    type: 'register',
                    name: 'kesunuo', // 这里传入插件的名称，需要和url上的kj_agent_plugin后面的名称相同，只能为字母
                },
            })
        );
    };

    useEffect(() => {
        registerPlugin();
        // if (window._ServicePluginDockInit) {
        //     registerPlugin();
        // } else {
        //     window.addEventListener(
        //         'service-plugin-dock-event-init',
        //         (e) => registerPlugin(),
        //         false
        //     );
        // }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <></>
    );
}

export default Marking;