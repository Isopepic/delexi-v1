import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

function msToTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getColorFromNote(n) {
  if (n <= 1) return '#c0392b';
  if (n <= 3) return '#e74c3c';
  if (n === 4) return '#e67e22';
  if (n <= 6) return '#f1c40f';
  if (n <= 8) return '#2ecc71';
  return '#27ae60';
}

const s = StyleSheet.create({
  // ── Cover page ──
  coverPage: {
    backgroundColor: '#111111',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  coverInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 24,
  },
  coverTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 26,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  coverOwner: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 12,
    color: '#888888',
    marginBottom: 28,
  },
  coverDivider: {
    width: 36,
    height: 2,
    backgroundColor: '#333333',
    marginBottom: 28,
  },
  coverAvgLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#666666',
    letterSpacing: 2,
    marginBottom: 6,
  },
  coverAvgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  coverAvgValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 52,
    color: '#ffffff',
    lineHeight: 1,
  },
  coverAvgOutOf: {
    fontFamily: 'Helvetica',
    fontSize: 18,
    color: '#555555',
    marginBottom: 8,
    marginLeft: 4,
  },
  coverNote: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 11,
    color: '#777777',
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 1.6,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  coverBrand: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#333333',
    letterSpacing: 3,
    marginTop: 40,
  },

  // ── Song pages ──
  songPage: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 32,
    paddingRight: 32,
    fontFamily: 'Helvetica',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  pageHeaderLeft: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#cccccc',
    letterSpacing: 1,
  },
  pageHeaderRight: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#cccccc',
  },

  // ── Song card ──
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 16,
  },
  cardStrip: {
    width: 8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardInfo: {
    flex: 1,
  },
  trackNum: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#cccccc',
    letterSpacing: 1,
    marginBottom: 6,
  },
  trackTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  trackArtist: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 11,
    color: '#666666',
    marginBottom: 5,
  },
  trackDuration: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#aaaaaa',
  },
  gradeArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 24,
    minWidth: 72,
  },
  gradeNumber: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 40,
    lineHeight: 1,
  },
  gradeOutOf: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#aaaaaa',
    marginBottom: 6,
  },
  wordText: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    color: '#aaaaaa',
    textAlign: 'center',
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#dddddd',
    letterSpacing: 3,
  },
});

function SongCardPDF({ track, note, word, index }) {
  const color = getColorFromNote(note);
  return (
    <View style={s.card}>
      <View style={[s.cardStrip, { backgroundColor: color }]} />
      <View style={s.cardBody}>
        <View style={s.cardInfo}>
          <Text style={s.trackNum}>{String(index).padStart(2, '0')}</Text>
          <Text style={s.trackTitle}>{track.name}</Text>
          <Text style={s.trackArtist}>{track.artist}</Text>
          <Text style={s.trackDuration}>{msToTime(track.duration_ms)}</Text>
        </View>
        <View style={s.gradeArea}>
          <Text style={[s.gradeNumber, { color }]}>{note}</Text>
          <Text style={s.gradeOutOf}>/10</Text>
          {word ? <Text style={s.wordText}>"{word}"</Text> : null}
        </View>
      </View>
    </View>
  );
}

function PlaylistPDF({ playlistData, notes, words, globalNote, average }) {
  const tracks = playlistData.tracks || [];

  // Group into pairs for 2-per-page layout
  const pages = [];
  for (let i = 0; i < tracks.length; i += 2) {
    pages.push(
      tracks.slice(i, i + 2).map((track, j) => ({ track, index: i + j + 1 }))
    );
  }

  return (
    <Document>
      {/* ── Cover page ── */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverInner}>
          {playlistData.image && (
            <Image src={playlistData.image} style={s.coverImage} />
          )}
          <Text style={s.coverTitle}>{playlistData.name ?? 'Playlist Review'}</Text>
          {playlistData.owner && (
            <Text style={s.coverOwner}>by {playlistData.owner}</Text>
          )}
          <View style={s.coverDivider} />
          <Text style={s.coverAvgLabel}>AVERAGE GRADE</Text>
          <View style={s.coverAvgRow}>
            <Text style={s.coverAvgValue}>{average}</Text>
            <Text style={s.coverAvgOutOf}> /10</Text>
          </View>
          {globalNote ? <Text style={s.coverNote}>{globalNote}</Text> : null}
          <Text style={s.coverBrand}>DELEXI</Text>
        </View>
      </Page>

      {/* ── Song pages (2 per page) ── */}
      {pages.map((pair, pageIndex) => (
        <Page key={pageIndex} size="A4" style={s.songPage}>
          <View style={s.pageHeader}>
            <Text style={s.pageHeaderLeft}>
              {(playlistData.name ?? 'PLAYLIST').toUpperCase()}
            </Text>
            <Text style={s.pageHeaderRight}>
              {pair[0].index}{pair[1] ? `–${pair[1].index}` : ''} / {tracks.length}
            </Text>
          </View>

          {pair.map(({ track, index }) => (
            <SongCardPDF
              key={track.id || index}
              track={track}
              note={notes[index - 1] ?? 0}
              word={words[index - 1] ?? ''}
              index={index}
            />
          ))}

          <View style={s.footer}>
            <Text style={s.footerText}>DELEXI</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export default PlaylistPDF;
