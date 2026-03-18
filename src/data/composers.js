export const PERIODS = {
  BAROQUE:       { id: 'BAROQUE',       name: 'Baroque',        years: '1600–1750',    color: '#C9A84C', light: '#F5E6B0' },
  CLASSICAL:     { id: 'CLASSICAL',     name: 'Classical',      years: '1750–1820',    color: '#4CAF7D', light: '#B5E8CC' },
  ROMANTIC:      { id: 'ROMANTIC',      name: 'Romantic',       years: '1820–1900',    color: '#E07040', light: '#F5C9A8' },
  LATE_ROMANTIC: { id: 'LATE_ROMANTIC', name: 'Late Romantic',  years: '1870–1920',    color: '#D0506A', light: '#F5B8C4' },
  IMPRESSIONIST: { id: 'IMPRESSIONIST', name: 'Impressionist',  years: '1880–1920',    color: '#7090D0', light: '#C0D0F0' },
  MODERN:        { id: 'MODERN',        name: 'Modern',         years: '1900–1950',    color: '#9060C0', light: '#D0B0E8' },
  CONTEMPORARY:  { id: 'CONTEMPORARY',  name: 'Contemporary',   years: '1950–present', color: '#50A0A0', light: '#A8D8D8' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function c(id, name, born, died, period, nationality, description, videos, children = []) {
  return { id, name, born, died, period, nationality, description, videos, children };
}
function v(title, youtubeId, performer = '') {
  return { title, youtubeId, performer };
}
function branch(id, name, children) {
  return { id, name, type: 'branch', children };
}

// ─── Tree Data ─────────────────────────────────────────────────────────────────
export const treeData = {
  id: 'root',
  name: 'Western Classical Music',
  type: 'root',
  children: [

    // ── BAROQUE ──────────────────────────────────────────────────────────────
    branch('baroque-branch', 'Baroque Foundations', [
      c('monteverdi', 'Claudio Monteverdi', 1567, 1643, 'BAROQUE', 'Italian',
        'Pioneer of opera and the madrigal. His work stands at the birth of the Baroque era and represents one of the most dramatic revolutions in Western music.',
        [v("L'Orfeo — Opera", 'ARBDHrpX_Fg'), v('Vespers of 1610', 'fFmKlkX_JRA')]),

      c('vivaldi', 'Antonio Vivaldi', 1678, 1741, 'BAROQUE', 'Italian',
        'The Red Priest. Prolific virtuoso composer who pushed the concerto form to new heights. Bach himself transcribed his concertos.',
        [v('The Four Seasons', 'GRxofEmo3HA'), v('Gloria in D major', 'k1-FJbLkNwY')]),

      c('handel', 'G.F. Handel', 1685, 1759, 'BAROQUE', 'German-British',
        'Master of the English oratorio. Settled in London, became the most celebrated composer of his era with works of grandeur and public spectacle.',
        [v('Messiah — Hallelujah', 'VbEFgSFEVlo'), v('Water Music Suite', 'tJBDs9TXRMA'), v('Music for the Royal Fireworks', 'EvMnKqfM9ws')]),
    ]),

    // ── BACH → MAIN LINEAGE ───────────────────────────────────────────────────
    c('bach', 'Johann Sebastian Bach', 1685, 1750, 'BAROQUE', 'German',
      'The pinnacle of Baroque polyphony and perhaps the greatest composer who ever lived. His mastery of counterpoint and harmonic invention laid the foundation for all Western music that followed.',
      [
        v('Goldberg Variations (Glenn Gould, 1981)', 'Ah392lnFHxM', 'Glenn Gould'),
        v('Brandenburg Concerto No. 3', 'zssQyiE4s1Y'),
        v('The Well-Tempered Clavier Bk 1 (Gould)', 'EZ-NYKYD5MM', 'Glenn Gould'),
        v('Cello Suite No. 1', '_YPzWFM7miE'),
        v('St. Matthew Passion', 'G0JFqBz0FDg'),
      ],
      [
        c('cpe-bach', 'C.P.E. Bach', 1714, 1788, 'CLASSICAL', 'German',
          'Son and pupil of J.S. Bach. A key bridge between Baroque counterpoint and the expressive freedom of Classicism.',
          [v('Prussian Sonata No. 1', 'YUVPBqXY3sc')]),

        c('beethoven', 'Ludwig van Beethoven', 1770, 1827, 'CLASSICAL', 'German',
          'Deaf from his forties, he composed his greatest works in silence. He bridged the Classical and Romantic eras, expanding every form he touched and changing music forever.',
          [
            v('Symphony No. 5', '_4IRMYuE1hI'),
            v('Symphony No. 9 — Ode to Joy', 't3217H8JppI'),
            v('Moonlight Sonata Op. 27 No. 2', '4Tr0otuiQuU'),
            v('Piano Concerto No. 5 "Emperor"', 'dJnkqc0-HRk'),
            v('String Quartet Op. 131', 'oZ-HxaMOm9w'),
          ],
          [
            c('schubert', 'Franz Schubert', 1797, 1828, 'ROMANTIC', 'Austrian',
              'Master of the German Lied and short forms. Extraordinarily prolific despite dying at 31, leaving over 600 songs and profound late chamber works.',
              [
                v('Ave Maria', 'BZVYW39YH_U'),
                v('Symphony No. 8 "Unfinished"', 'uPSBMkVCQaY'),
                v('String Quintet in C — Adagio', 'HLMGDyWKPms'),
                v('Winterreise (Fischer-Dieskau)', 'EsZGBYpYqkQ', 'Fischer-Dieskau'),
              ]),

            c('czerny', 'Carl Czerny', 1791, 1857, 'ROMANTIC', 'Austrian',
              'Beethoven\'s most famous pupil and devoted teacher. His systematic études shaped the modern piano technique, most notably in his student Franz Liszt.',
              [v('Piano Studies Op. 299', 'oZYVT5OL5xk')],
              [
                c('liszt', 'Franz Liszt', 1811, 1886, 'ROMANTIC', 'Hungarian',
                  'The greatest piano virtuoso of the 19th century. He invented the solo piano recital, the symphonic poem, and transformed harmonic language in ways that pointed directly toward Wagner and Debussy.',
                  [
                    v('Hungarian Rhapsody No. 2', 'Ph0MstmLjEQ'),
                    v('Transcendental Étude No. 10 "Appassionata"', 'A5LN44AhUyg'),
                    v('Piano Sonata in B minor', 'vCVfMBkNprA'),
                    v('Liebestraum No. 3', 'gOBFCYwnFuU'),
                  ],
                  [
                    c('wagner', 'Richard Wagner', 1813, 1883, 'ROMANTIC', 'German',
                      'The most radical force in 19th-century music. He stretched tonality to its limits, invented the leitmotif, and his revolutionary harmonic language in Tristan und Isolde pointed directly to Schoenberg\'s atonality.',
                      [
                        v('Ride of the Valkyries', 'P_FVRNQj3ec'),
                        v('Tristan und Isolde — Prelude', 'CqP3Avqy3sk'),
                        v('Siegfried\'s Funeral March', 'vGBApbfkwcs'),
                      ],
                      [
                        c('mahler', 'Gustav Mahler', 1860, 1911, 'LATE_ROMANTIC', 'Austrian',
                          'The last great Romantic symphonist, bridging the 19th and 20th centuries. His vast, turbulent symphonies grapple with life, death, and the cosmos.',
                          [
                            v('Symphony No. 5 — Adagietto', 'ULpM0dRhKFw'),
                            v('Symphony No. 9 — Andante comodo', 'xT4PITtSIXU'),
                            v('Das Lied von der Erde', 'cHsYQbC3hVA'),
                          ],
                          [
                            c('schoenberg', 'Arnold Schoenberg', 1874, 1951, 'MODERN', 'Austrian',
                              'Inventor of twelve-tone technique and the father of the Second Viennese School. He took Wagner\'s harmonic dissolution to its logical conclusion — complete atonality.',
                              [
                                v('Verklärte Nacht', 'vqODySSxGdc'),
                                v('Piano Suite Op. 25', 'kW5gP8dVMDs'),
                              ],
                              [
                                c('berg', 'Alban Berg', 1885, 1935, 'MODERN', 'Austrian',
                                  'Student of Schoenberg who combined twelve-tone technique with late Romantic warmth and expressionism.',
                                  [v('Violin Concerto', 'sbLAOFuN2NI'), v('Wozzeck — Opera', 'ohNLp0RKQrI')]),
                                c('webern', 'Anton Webern', 1883, 1945, 'MODERN', 'Austrian',
                                  'Schoenberg\'s most radical pupil. His extremely compressed, pointillistic works would profoundly influence post-war serialist composers.',
                                  [v('Five Pieces Op. 10', '9N-dvuHpMQI')]),
                              ]),
                          ]),

                        c('rstrauss', 'Richard Strauss', 1864, 1949, 'LATE_ROMANTIC', 'German',
                          'Master of the tone poem and opera. Extended the Wagnerian orchestral language to its most opulent extreme.',
                          [
                            v('Also Sprach Zarathustra', 'ETveS23djXM'),
                            v('Four Last Songs', 'ACN-JZ-iJ4E'),
                            v('Der Rosenkavalier — Suite', 'Vy_xpOST5Mc'),
                          ]),
                      ]),

                    c('brahms', 'Johannes Brahms', 1833, 1897, 'ROMANTIC', 'German',
                      'The great conservative of the 19th century. Where Wagner pushed forward, Brahms looked back to Bach and Beethoven, producing symphonies and chamber music of extraordinary depth.',
                      [
                        v('Symphony No. 4', 'N3K_kCjhFkE'),
                        v('Piano Concerto No. 2', 'WBMRLO_Ymd4'),
                        v('Violin Concerto', 'pR9fkTiCkE8'),
                        v('Intermezzo Op. 118 No. 2', 'bE5ROgqNVkA'),
                      ],
                      [
                        c('dvorak', 'Antonín Dvořák', 1841, 1904, 'ROMANTIC', 'Czech',
                          'Master of National Romanticism. Fused Bohemian folk elements with the Germanic symphonic tradition, famously visiting America and composing the "New World" Symphony.',
                          [
                            v('Symphony No. 9 "New World"', '_WXHkIAeChQ'),
                            v('Cello Concerto', 'NqkBIJRrIaI'),
                            v('String Quartet "American"', 'sBp2-fHRDcI'),
                          ]),
                        c('clara-schumann', 'Clara Schumann', 1819, 1896, 'ROMANTIC', 'German',
                          'One of the most distinguished pianists of the Romantic era and a gifted composer. Close friend of Brahms, widow of Robert Schumann.',
                          [v('Piano Concerto in A minor', 'ZR3ycLhEgAQ'), v('Piano Sonata in G minor', 'k10jGGxGkIo')]),
                      ]),

                    c('saint-saens', 'Camille Saint-Saëns', 1835, 1921, 'ROMANTIC', 'French',
                      'A prodigy with astonishing facility and wit. He was both a great organist-composer and champion of French music, and teacher of Fauré.',
                      [
                        v('Carnival of the Animals', 'RbSXcMKp8mE'),
                        v('Piano Concerto No. 2', 'VJlbBo4yiKE'),
                        v('Symphony No. 3 "Organ"', 'ORDHqyDdmFU'),
                      ],
                      [
                        c('faure', 'Gabriel Fauré', 1845, 1924, 'LATE_ROMANTIC', 'French',
                          'The subtle master of French song and piano music. His harmonic innovations, though quiet and understated, were as radical as Wagner\'s — and he taught Ravel.',
                          [
                            v('Requiem', 'MRo3tQH7CqU'),
                            v('Pavane Op. 50', 'FRSAVAJq7ik'),
                            v('Nocturnes (complete)', 'J4fkD5p2B64'),
                          ],
                          [
                            c('ravel', 'Maurice Ravel', 1875, 1937, 'IMPRESSIONIST', 'French',
                              'The supreme craftsman. Every note is in its place. Ravel\'s impeccable orchestration, crystalline textures, and bittersweet harmonies mark the pinnacle of French music.',
                              [
                                v('Boléro', 'mhhkGyJ092E'),
                                v('Piano Concerto in G', 'AijVEqq1QGQ'),
                                v('La Valse', '_WqkAoGC9w0'),
                                v('Gaspard de la Nuit (Argerich)', '1_fH7J1-HpI', 'Martha Argerich'),
                              ]),
                          ]),
                      ]),

                    c('grieg', 'Edvard Grieg', 1843, 1907, 'ROMANTIC', 'Norwegian',
                      'The voice of Norway. He distilled Norwegian folk idioms into the Romantic language, creating music of vivid atmosphere and lyrical beauty.',
                      [
                        v('Piano Concerto in A minor', 'MiJLsGqv37E'),
                        v('Peer Gynt Suite No. 1', 'O0tH-fkFRZU'),
                      ]),

                    c('sibelius', 'Jean Sibelius', 1865, 1957, 'LATE_ROMANTIC', 'Finnish',
                      'The voice of Finland. His symphonies chart a journey from lush late Romanticism to austere economy — the 7th Symphony achieves total formal concentration in a single movement.',
                      [
                        v('Violin Concerto', 'tBx31CIkE74'),
                        v('Symphony No. 2', 'WNTMFy_Lr-A'),
                        v('Finlandia', 'I8ctfFs_WKQ'),
                      ]),
                  ]),
              ]),
          ]),
      ]),

    // ── ROMANTIC PARALLEL ─────────────────────────────────────────────────────
    branch('romantic-branch', 'Romantic Voices', [
      c('schumann', 'Robert Schumann', 1810, 1856, 'ROMANTIC', 'German',
        'Poet of the Romantic piano miniature. Schumann\'s music reflects his turbulent inner life; he famously championed the young Brahms.',
        [
          v('Piano Concerto in A minor', 'Kqpnpf1MDKA'),
          v('Kinderszenen Op. 15', 'CqFJJJVsXaE'),
          v('Dichterliebe Song Cycle', 'k2yNMWf8yiw'),
        ]),

      c('chopin', 'Frédéric Chopin', 1810, 1849, 'ROMANTIC', 'Polish',
        'The poet of the piano. Chopin rarely left the keyboard, inventing an entirely new harmonic and expressive language for the instrument — one that influenced every pianist and composer after him.',
        [
          v('Nocturne Op. 9 No. 2', '9E6b3swbnWg'),
          v('Ballade No. 1 in G minor', 'VmFmAvC4YA8'),
          v('Piano Sonata No. 2 "Funeral March"', 'vUTx0gpMDyQ'),
          v('24 Études (Pollini)', 'atXTEEFvFNA', 'Maurizio Pollini'),
          v('4 Ballades (Zimerman)', 'bE5ROgqNVkA', 'Krystian Zimerman'),
        ],
        [
          c('scriabin', 'Alexander Scriabin', 1872, 1915, 'MODERN', 'Russian',
            'Began in Chopin\'s world and ended in a private universe of mystical atonality. His late works are like no other music — dense, vertiginous, unearthly.',
            [
              v('Piano Sonata No. 5', 'RGDyFb6TG4M'),
              v('Poem of Ecstasy', 'yA8rH7CFXDM'),
              v('Études Op. 42', 'jwPbx5CXGDQ'),
            ]),

          c('rachmaninoff', 'Sergei Rachmaninoff', 1873, 1943, 'LATE_ROMANTIC', 'Russian',
            'The last great Romantic composer. He suffered a long creative crisis before producing his most beloved works — concertos of sweep and yearning that remain the most performed in the repertoire.',
            [
              v('Piano Concerto No. 2', 'rEGOihjqO9w'),
              v('Rhapsody on a Theme of Paganini', 'kHIGzwc-Yew'),
              v('Symphony No. 2', 'SJCeRLOa9Oc'),
              v('Piano Concerto No. 3 (Horowitz)', 'vFskSlMwpg4', 'Vladimir Horowitz'),
            ],
            [
              c('horowitz', 'Vladimir Horowitz', 1903, 1989, 'CONTEMPORARY', 'Russian-American',
                'The last great Romantic pianist. His technique was supernatural, his interpretations deeply personal. His 1965 Carnegie Hall return after a 12-year absence is legendary.',
                [
                  v('Carnegie Hall Return 1965', 'dKFvNVPCmrg'),
                  v('Scarlatti Sonatas', 'jG5Xts-vwIY'),
                  v('Rachmaninoff Piano Concerto No. 3', 'vFskSlMwpg4'),
                ]),
            ]),
        ]),

      c('tchaikovsky', 'Pyotr Tchaikovsky', 1840, 1893, 'ROMANTIC', 'Russian',
        'Russia\'s most beloved composer. He combined the Romantic virtuosity of Western Europe with deep Russian lyricism, producing the most famous ballets ever written.',
        [
          v('Piano Concerto No. 1', 'AAMPuRU4BFU'),
          v('Violin Concerto', 'KDntuhCqNW4'),
          v('Swan Lake — Ballet', 'gG5RmfxVLa0'),
          v('1812 Overture', 'VbM4EIEQb6Q'),
        ]),
    ]),

    // ── FRENCH IMPRESSIONISM ──────────────────────────────────────────────────
    branch('impressionist-branch', 'French Impressionism', [
      c('debussy', 'Claude Debussy', 1862, 1918, 'IMPRESSIONIST', 'French',
        'The founder of musical impressionism. Debussy dissolved the iron structures of tonal harmony in favour of colour, atmosphere, and the shimmer of suggestion — opening the door to modernism.',
        [
          v('Clair de Lune', 'CvFH_6DNRCY'),
          v('La Mer', 'j5oJt6FVilQ'),
          v('Prélude à l\'après-midi d\'un faune', 'tKVmKgvSCIE'),
          v('Préludes Book 1 (Gieseking)', 'G3-4VFkLUAY', 'Walter Gieseking'),
        ]),
    ]),

    // ── RUSSIAN & MODERN ──────────────────────────────────────────────────────
    branch('modern-branch', 'Modern & 20th Century', [
      c('stravinsky', 'Igor Stravinsky', 1882, 1971, 'MODERN', 'Russian',
        'The most stylistically versatile composer of the 20th century. He moved from lush post-Romanticism through primitivism, neoclassicism, and finally serialism.',
        [
          v('The Rite of Spring', '5UJOaGIhG7A'),
          v('The Firebird Suite', '3tqhBCM6HxE'),
          v('Petrushka', 'cEfHe8_wd4k'),
          v('Symphony of Psalms', 'FGNBrHFQJtY'),
        ]),

      c('bartok', 'Béla Bartók', 1881, 1945, 'MODERN', 'Hungarian',
        'Pioneer of ethnomusicology who fused peasant folk music from Eastern Europe with the most advanced modernist techniques of his time.',
        [
          v('Piano Concerto No. 3', 'YcnX8GhVBDk'),
          v('Music for Strings, Percussion & Celesta', 'DixMhDsRxG8'),
          v('String Quartet No. 4', 'a4dCGKdU8_4'),
        ]),

      c('prokofiev', 'Sergei Prokofiev', 1891, 1953, 'MODERN', 'Russian',
        'Crisp, sardonic, and deeply lyrical in equal measure. He wrote under Soviet repression yet produced some of the most vital and inventive music of the 20th century.',
        [
          v('Piano Concerto No. 3', 'fnmUvSEPOuY'),
          v('Romeo and Juliet — Dance of the Knights', 'rvqKl8ERnW4'),
          v('Symphony No. 1 "Classical"', 'F7kmJBwLGVU'),
        ],
        [
          c('shostakovich', 'Dmitri Shostakovich', 1906, 1975, 'MODERN', 'Russian',
            'The great voice of the Soviet era. His music is a coded record of suffering and survival — alternating between biting satire and the deepest tragedy.',
            [
              v('Symphony No. 5', 'mP-gnCzuapk'),
              v('String Quartet No. 8', 'RXBmKhBjlqo'),
              v('Piano Concerto No. 2', 'e5l5UzuHEMk'),
            ]),
        ]),
    ]),

    // ── CONTEMPORARY ─────────────────────────────────────────────────────────
    branch('contemporary-branch', 'Contemporary & Minimal', [
      c('part', 'Arvo Pärt', 1935, null, 'CONTEMPORARY', 'Estonian',
        'Creator of the tintinnabuli style. After a long creative silence, Pärt emerged with music of monastic stillness and spiritual depth that speaks directly to the soul.',
        [
          v('Spiegel im Spiegel', 'TJ6Mzvh3XCc'),
          v('Für Alina', '1hlzZB_Nzf0'),
          v('Tabula Rasa', 'Knj3UdKdGMU'),
        ]),

      c('glass', 'Philip Glass', 1937, null, 'CONTEMPORARY', 'American',
        'The most prominent figure in musical minimalism. His hypnotic, cycling patterns have permeated concert halls, operas, and film scores worldwide.',
        [
          v('Metamorphosis Two', 'FaovqbcSYqk'),
          v('Koyaanisqatsi', 'jBzXqBJuBME'),
          v('Violin Concerto No. 1', 'OtQOLw_I1LQ'),
        ]),

      c('reich', 'Steve Reich', 1936, null, 'CONTEMPORARY', 'American',
        'Pioneer of phasing and process music. His work with tape loops and live instruments transformed Western music\'s relationship with rhythm and time.',
        [
          v('Music for 18 Musicians', 'PBiU1wMEPNk'),
          v('Different Trains', 'tCpxC8lmkT0'),
          v('Electric Counterpoint', 'vugqRAX7xQE'),
        ]),

      c('adams', 'John Adams', 1947, null, 'CONTEMPORARY', 'American',
        'Post-minimalist. He brought narrative, lyricism, and harmonic richness back to minimalism. Nixon in China is a landmark of late 20th-century opera.',
        [
          v('Shaker Loops', 'eiLyfZR1wnI'),
          v('Short Ride in a Fast Machine', 'dpUyQkxD09A'),
        ]),
    ]),

    // ── GREAT PERFORMERS ─────────────────────────────────────────────────────
    branch('performers-branch', 'Great Performers', [
      c('gould', 'Glenn Gould', 1932, 1982, 'CONTEMPORARY', 'Canadian',
        'The most idiosyncratic and influential pianist of the 20th century. He retired from concert at 31, recording studio performances of uncanny intellectual depth. His 1981 Goldberg Variations is one of the great artistic farewells.',
        [
          v('Goldberg Variations 1981', 'Ah392lnFHxM'),
          v('Bach WTC Book 1', 'EZ-NYKYD5MM'),
          v('Beethoven Sonata Op. 109', 'xvlJMR-NLEI'),
        ]),

      c('gieseking', 'Walter Gieseking', 1895, 1956, 'CONTEMPORARY', 'German',
        'Legendary for his feather-light touch and extraordinary tonal palette. His recordings of Debussy and Ravel remain unsurpassed benchmarks.',
        [
          v('Debussy Préludes Book 1', 'G3-4VFkLUAY'),
          v('Mozart Piano Sonatas', 'QCwHNiKWiGs'),
        ]),

      c('richter', 'Sviatoslav Richter', 1915, 1997, 'CONTEMPORARY', 'Russian',
        'Titan of 20th-century piano. A vast repertoire performed at the highest level, an overwhelming physical and intellectual presence, and legendary live concerts.',
        [
          v('Schubert Wanderer Fantasy', 'OmQBnMjcKo8'),
          v('Beethoven "Hammerklavier" Sonata', 'pJnFdV8LXYY'),
          v('Prokofiev Piano Concerto No. 5', 'PoECd9BXK6A'),
        ],
        [
          c('zimerman', 'Krystian Zimerman', 1956, null, 'CONTEMPORARY', 'Polish',
            'One of the supreme pianists of the modern era. A consummate perfectionist, his Chopin and Brahms are considered definitive interpretations.',
            [
              v('Brahms Piano Concerto No. 2', 'WBMRLO_Ymd4'),
              v('Chopin Piano Concerto No. 1', 'cBDl_lH_B40'),
            ]),
          c('wang', 'Yuja Wang', 1987, null, 'CONTEMPORARY', 'Chinese',
            'Dazzling technique combined with fearless musicianship. One of the most exciting pianists of her generation.',
            [
              v('Prokofiev Piano Concerto No. 3', 'fnmUvSEPOuY'),
              v('Ravel Gaspard de la Nuit', '1_fH7J1-HpI'),
            ]),
        ]),

      c('argerich', 'Martha Argerich', 1941, null, 'CONTEMPORARY', 'Argentine',
        'Perhaps the greatest living pianist. Explosive, risk-taking, deeply musical — she has defined interpretations of Chopin, Schumann, Prokofiev, and Ravel for generations.',
        [
          v('Ravel Piano Concerto in G', 'AijVEqq1QGQ'),
          v('Chopin Piano Sonata No. 3', 'SjnKR8V0v60'),
          v('Prokofiev Piano Concerto No. 3', 'fWEQMbrXWqY'),
        ],
        [
          c('trifonov', 'Daniil Trifonov', 1991, null, 'CONTEMPORARY', 'Russian',
            'The prodigy of the current generation. Combines technical brilliance with rare musical sensitivity and extraordinary intellectual depth.',
            [
              v('Chopin Études', 'SjnKR8V0v60'),
              v('Rachmaninoff Piano Concerto No. 3', 'YL-RdSV3xag'),
              v('Liszt Piano Sonata in B minor', 'vCVfMBkNprA'),
            ]),
        ]),

      c('pollini', 'Maurizio Pollini', 1942, 2024, 'CONTEMPORARY', 'Italian',
        'The supreme intellectual pianist. Crystal-clear technique and an architecture of steely logic made his Chopin and Beethoven benchmarks for all time.',
        [
          v('Chopin 24 Études', 'atXTEEFvFNA'),
          v('Beethoven Piano Sonatas (late)', 'oZ-HxaMOm9w'),
        ]),
    ]),
  ],
};

// ─── Flat list for timeline ────────────────────────────────────────────────────
export function flatComposers() {
  const result = [];
  function walk(node) {
    if (node.period) result.push(node);
    if (node.children) node.children.forEach(walk);
  }
  treeData.children.forEach(walk);
  return result.sort((a, b) => a.born - b.born);
}
