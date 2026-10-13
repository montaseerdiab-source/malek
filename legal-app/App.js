import React, { useMemo, useState } from 'react';
import { I18nManager, SafeAreaView, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ITEMS, TOPICS, PLATFORMS } from './src/data';
import { searchLive } from './src/ai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const COLORS = { صح: '#1b8a4b', خطأ: '#c0392b', يعتمد: '#b9770e' };

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.chip, active && s.chipOn]}>
      <Text style={[s.chipT, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Card({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setOpen(!open)} style={s.card}>
      <View style={s.row}>
        <Text style={s.meta}>{item.platform} · {item.topic}</Text>
        <Text style={[s.badge, { backgroundColor: COLORS[item.verdict] }]}>{item.verdict}</Text>
      </View>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.body}>{item.summary}</Text>
      {open && (
        <View style={{ marginTop: 8 }}>
          <Text style={s.h}>لك</Text>
          {item.rights.map((r, i) => <Text key={i} style={s.li}>• {r}</Text>)}
          <Text style={s.h}>عليك</Text>
          {item.duties.map((r, i) => <Text key={i} style={s.li}>• {r}</Text>)}
          <Text style={s.h}>الخلاصة</Text>
          <Text style={s.li}>{item.verdictNote}</Text>
          <Text style={s.meta}>المصدر: {item.source}{item.url ? ` — ${item.url}` : ''}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function App() {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('الكل');
  const [platform, setPlatform] = useState('الكل');
  const [live, setLive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const runSearch = async () => {
    setBusy(true); setErr('');
    try { setLive(await searchLive(q, platform)); }
    catch (e) { setErr('تعذّر الاتصال بالخادم، تُعرض بيانات تجريبية.'); setLive(null); }
    setBusy(false);
  };
  const data = useMemo(() => (live || ITEMS).filter(i =>
    (topic === 'الكل' || i.topic === topic) &&
    (platform === 'الكل' || i.platform === platform) &&
    (live || !q || (i.title + i.summary).includes(q))), [q, topic, platform, live]);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="dark" />
      <Text style={s.app}>حقوقي</Text>
      <TextInput style={s.input} placeholder="ابحث: عقد، إيجار، مخالفة…" value={q} onChangeText={setQ} textAlign="right" onSubmitEditing={runSearch} returnKeyType="search" />
      {busy && <Text style={s.empty}>جارٍ البحث والتلخيص…</Text>}
      {!!err && <Text style={s.disc}>{err}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
        {TOPICS.map(t => <Chip key={t} label={t} active={t === topic} onPress={() => setTopic(t)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
        {PLATFORMS.map(t => <Chip key={t} label={t} active={t === platform} onPress={() => setPlatform(t)} />)}
      </ScrollView>
      <FlatList data={data} keyExtractor={i => i.id} renderItem={({ item }) => <Card item={item} />}
        ListEmptyComponent={<Text style={s.empty}>لا توجد نتائج</Text>} contentContainerStyle={{ padding: 12 }} />
      <Text style={s.disc}>معلومات عامة للتوعية وليست استشارة قانونية. راجع محاميًا مختصًا في قضيتك.</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f7f9', paddingTop: 32 },
  app: { fontSize: 24, fontWeight: '700', textAlign: 'right', marginHorizontal: 16 },
  input: { backgroundColor: '#fff', margin: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e1e4e8' },
  chips: { flexGrow: 0, paddingHorizontal: 8, marginBottom: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e8ebef', marginHorizontal: 4 },
  chipOn: { backgroundColor: '#1f3a5f' }, chipT: { color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#777', fontSize: 12, textAlign: 'right' },
  badge: { color: '#fff', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', fontSize: 12 },
  title: { fontSize: 17, fontWeight: '600', textAlign: 'right', marginTop: 6 },
  body: { color: '#444', textAlign: 'right', marginTop: 4, lineHeight: 22 },
  h: { fontWeight: '700', textAlign: 'right', marginTop: 6 },
  li: { textAlign: 'right', color: '#333', lineHeight: 22 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  disc: { fontSize: 11, color: '#666', textAlign: 'center', padding: 8 },
});
