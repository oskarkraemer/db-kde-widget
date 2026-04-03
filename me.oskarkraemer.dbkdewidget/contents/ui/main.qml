import QtQuick
import QtQuick.Layouts
import QtWebEngine
import org.kde.plasma.plasmoid
import org.kde.kirigami as Kirigami

PlasmoidItem {
    id: root

    readonly property bool isDev: false 
    readonly property string devUrl: "http://localhost:5173"
    readonly property string prodUrl: Qt.resolvedUrl("index.html")

    width: 400
    height: 300

    // This listens for global theme changes
    Connections {
        target: Kirigami.Theme
        function onColorsChanged() {
            root.injectTheme();
        }
    }

    function injectTheme() {
        // Kirigami.Theme provides the most accurate system colors
        let cssVars = `
            :root {
                --plasma-bg: ${Kirigami.Theme.backgroundColor};
                --plasma-text: ${Kirigami.Theme.textColor};
                --plasma-highlight: ${Kirigami.Theme.highlightColor};
                --plasma-highlight-text: ${Kirigami.Theme.highlightedTextColor};
                --plasma-button-bg: ${Kirigami.Theme.buttonBackgroundColor};
                --plasma-button-text: ${Kirigami.Theme.buttonTextColor};
            }
        `;
        
        let js = `
            (function() {
                let style = document.getElementById('plasma-theme-vars');
                if (!style) {
                    style = document.createElement('style');
                    style.id = 'plasma-theme-vars';
                    document.head.appendChild(style);
                }
                style.textContent = \`${cssVars}\`;
            })();
        `;
        webengine.runJavaScript(js);
    }

    fullRepresentation: Item {
        WebEngineView {
            id: webengine
            anchors.fill: parent
            backgroundColor: "transparent"
            url: root.isDev ? root.devUrl : root.prodUrl
            
            settings.javascriptEnabled: true
            settings.localContentCanAccessRemoteUrls: true
            settings.allowRunningInsecureContent: true

            onLoadingChanged: function(loadRequest) {
                if (loadRequest.status === WebEngineView.LoadSucceededStatus) {
                    root.injectTheme();
                }
            }
        }
    }
}