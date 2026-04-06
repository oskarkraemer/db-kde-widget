import QtQuick
import QtQuick.Layouts
import QtWebEngine
import QtWebChannel
import org.kde.plasma.plasmoid

PlasmoidItem {
    id: root

    readonly property bool isDev: false 
    readonly property string devUrl: "http://localhost:5173"
    readonly property string prodUrl: Qt.resolvedUrl("index.html")

    width: 400
    height: 300

    QtObject {
        id: configBridge
        WebChannel.id: "configBridge"

        property string from_station_id: Plasmoid.configuration.from_station_id
        property string from_station_name: Plasmoid.configuration.from_station_name
        property string to_station_id: Plasmoid.configuration.to_station_id
        property string to_station_name: Plasmoid.configuration.to_station_name
        property int refresh_interval: Plasmoid.configuration.refresh_interval

        function setFromStation(id, name) {
            Plasmoid.configuration.from_station_id = id;
            Plasmoid.configuration.from_station_name = name;
        }

        function setToStation(id, name) {
            Plasmoid.configuration.to_station_id = id;
            Plasmoid.configuration.to_station_name = name;
        }

        function setRefreshInterval(interval) {
            Plasmoid.configuration.refresh_interval = interval;
        }
    }

    WebChannel {
        id: plasmaWebChannel
        registeredObjects: [configBridge]
    }

    fullRepresentation: Item {
        WebEngineView {
            id: webengine
            anchors.fill: parent
            backgroundColor: "transparent"
            url: root.isDev ? root.devUrl : root.prodUrl
            
            webChannel: plasmaWebChannel
            
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