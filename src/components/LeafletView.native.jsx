import { WebView } from 'react-native-webview'

export default function LeafletView({ html, onMessage, style }) {
  return (
    <WebView
      source={{ html }}
      onMessage={onMessage}
      javaScriptEnabled
      domStorageEnabled
      originWhitelist={['*']}
      mixedContentMode="always"
      style={[{ flex: 1 }, style]}
    />
  )
}
