import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'

export default function LeafletView({ html, onMessage, style }) {
  useEffect(() => {
    function handleMessage(event) {
      if (!onMessage || !event.data) return
      try {
        JSON.parse(event.data)
        onMessage({ nativeEvent: { data: event.data } })
      } catch (_) {}
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onMessage])

  return (
    <View style={[styles.container, style]}>
      <iframe
        srcDoc={html}
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
        sandbox="allow-scripts allow-same-origin"
        title="Hippy Map"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
