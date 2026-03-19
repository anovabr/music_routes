export const PERIODS = {
  BAROQUE:       { id: 'BAROQUE',       name: 'Baroque',        years: '1600–1750',    color: '#C9A84C' },
  CLASSICAL:     { id: 'CLASSICAL',     name: 'Classical',      years: '1750–1820',    color: '#4CAF7D' },
  ROMANTIC:      { id: 'ROMANTIC',      name: 'Romantic',       years: '1820–1900',    color: '#E07040' },
  LATE_ROMANTIC: { id: 'LATE_ROMANTIC', name: 'Late Romantic',  years: '1870–1920',    color: '#D0506A' },
  IMPRESSIONIST: { id: 'IMPRESSIONIST', name: 'Impressionist',  years: '1880–1920',    color: '#7090D0' },
  MODERN:        { id: 'MODERN',        name: 'Modern',         years: '1900–1950',    color: '#9060C0' },
  CONTEMPORARY:  { id: 'CONTEMPORARY',  name: 'Contemporary',   years: '1950–present', color: '#50A0A0' },
};

function c(id, name, born, died, period, nationality, description, videos, children = []) {
  return { id, name, born, died, period, nationality, description, videos, children };
}
function v(title, youtubeId, performer = '') {
  return { title, youtubeId, performer };
}

// ─── Tree Data ─────────────────────────────────────────────────────────────────
// Each node's children = composers they directly taught or most decisively shaped.
export const treeData = {
  id: 'root',
  name: 'Western Classical Music',
  type: 'root',
  children: [

    // ── ITALIAN OPERA: MONTEVERDI → BEL CANTO → VERDI → PUCCINI ───────────────
    c('monteverdi', 'Claudio Monteverdi', 1567, 1643, 'BAROQUE', 'Italian',
      'The inventor of opera. His L\'Orfeo (1607) launched an entirely new art form. His radical text-setting and harmonic daring mark the birth of the Baroque era.',
      [v("L'Orfeo — Opera", 'ARBDHrpX_Fg'), v('Vespers of 1610', 'fFmKlkX_JRA')],
      [
        // Opera tradition branch
        c('rossini', 'Gioachino Rossini', 1792, 1868, 'ROMANTIC', 'Italian',
          'The first international superstar of opera. His wit and melodic genius in The Barber of Seville set the standard for bel canto. He retired at 37, having shaped Donizetti, Bellini, and indirectly Verdi.',
          [v('The Barber of Seville — Overture', 'OloXRhxnrE8'), v('William Tell — Overture', 'c7O91GDWGPU'), v('La Cenerentola — Non più mesta', 'EtKMtzAaJP8')],
          [
            c('donizetti', 'Gaetano Donizetti', 1797, 1848, 'ROMANTIC', 'Italian',
              'Master of bel canto who wrote over 70 operas. His Lucia di Lammermoor contains one of opera\'s most famous mad scenes.',
              [v('Lucia di Lammermoor — Mad Scene', 'r8E_7M7LL4U'), v("L'elisir d'amore — Una furtiva lagrima", 'fN7zHhYghQ4')]),
            c('bellini', 'Vincenzo Bellini', 1801, 1835, 'ROMANTIC', 'Italian',
              'The supreme melodist of bel canto. His long-breathed lines in Norma influenced Chopin\'s piano writing. Died at just 33.',
              [v('Norma — Casta Diva', 'fzPXwJEjpbo'), v('I Puritani — A te, o cara', 'kThNJZJiJck')]),
            c('verdi', 'Giuseppe Verdi', 1813, 1901, 'ROMANTIC', 'Italian',
              'Italy\'s greatest opera composer and a national hero of the Risorgimento. From Rigoletto to Otello, he brought unprecedented dramatic truth and psychological depth to opera.',
              [v('Rigoletto — La donna è mobile', 'xCFEk6Y8TsA'), v('La Traviata — Brindisi', 'g0WlNh2McaI'), v('Aida — Triumphal March', 'ZDFFHaz9GsY'), v('Requiem — Dies Irae', 'pW1Uc-grcMs')],
              [
                c('puccini', 'Giacomo Puccini', 1858, 1924, 'LATE_ROMANTIC', 'Italian',
                  'The heir to Verdi\'s operatic throne. His gift for soaring melody and theatrical timing in La Bohème, Tosca, and Madama Butterfly made him the most performed opera composer today.',
                  [v('La Bohème — Che gelida manina', 'bTFJRZ2RvaE'), v('Tosca — E lucevan le stelle', 'nYDbIm2xJas'), v('Madama Butterfly — Un bel dì', 'hS9YKjRlSjg'), v('Turandot — Nessun dorma', 'cWc7vYjgnMc')]),
              ]),
          ]),

        // Oratorio tradition → Classical lineage
        c('handel', 'G.F. Handel', 1685, 1759, 'BAROQUE', 'German-British',
          'Master of the English oratorio. His Messiah (1741) was so overwhelming it moved Haydn to tears and directly inspired him to compose The Creation. Handel defined large-scale choral drama for all who followed.',
          [v('Messiah — Hallelujah', 'VbEFgSFEVlo'), v('Water Music Suite', 'tJBDs9TXRMA'), v('Music for the Royal Fireworks', 'EvMnKqfM9ws')],
          [
            c('haydn', 'Joseph Haydn', 1732, 1809, 'CLASSICAL', 'Austrian',
              'Father of the symphony and the string quartet. Inspired by Handel\'s oratorios, his Creation is the crowning achievement of Classical choral music. He taught Beethoven counterpoint in Vienna from 1792.',
              [v('Symphony No. 94 "Surprise"', 'r9YAEl3LAi4'), v('String Quartet Op. 76 "Emperor"', 'QLvQSOLSHQA'), v('The Creation', 'KFiRVQqxBHM')],
              [
                c('mozart', 'Wolfgang Amadeus Mozart', 1756, 1791, 'CLASSICAL', 'Austrian',
                  'Perhaps the most naturally gifted composer in history. His command of opera, symphony, concerto, and chamber music is unsurpassed. He and Haydn were the closest of friends; each shaped the other\'s mature style. His most celebrated student, Hummel, carried the Classical piano ideal directly into the Romantic age.',
                  [
                    v('Symphony No. 40 in G minor', 'W1fPHBgBelc'),
                    v('Piano Concerto No. 21', 'EvpFe2k5e4I'),
                    v('Don Giovanni Overture', 'SgBMTyq1z1s'),
                    v('Requiem — Lacrimosa', 'FyVJRPSLZXY'),
                  ],
                  [
                    c('hummel', 'J.N. Hummel', 1778, 1837, 'CLASSICAL', 'Austrian',
                      'Mozart\'s star pupil — he lived in the Mozart household from age 8. The most celebrated pianist between Mozart and Liszt, his crystalline technique and singing tone were the direct model for Chopin\'s early style. He also taught the young Mendelssohn.',
                      [
                        v('Trumpet Concerto in E-flat', 'cE3ZjFBFqcA'),
                        v('Piano Concerto No. 2 in A minor', 'vbpXALo1fkA'),
                        v('Piano Sonata Op. 81', 'g4BOVP3TCKE'),
                      ],
                      [
                        c('chopin', 'Frédéric Chopin', 1810, 1849, 'ROMANTIC', 'Polish',
                          'The poet of the piano. He modelled his early concertos directly on Hummel\'s — then went far beyond, inventing an entirely new harmonic and expressive language that influenced every pianist after him.',
                          [
                            v('Nocturne Op. 9 No. 2', '9E6b3swbnWg'),
                            v('Ballade No. 1 in G minor', 'VmFmAvC4YA8'),
                            v('Piano Sonata No. 2 "Funeral March"', 'vUTx0gpMDyQ'),
                            v('24 Études (Pollini)', 'atXTEEFvFNA', 'Maurizio Pollini'),
                          ],
                          [
                            c('scriabin', 'Alexander Scriabin', 1872, 1915, 'MODERN', 'Russian',
                              'Began in Chopin\'s world and ended in a private universe of mystical atonality. His late works are like no other music — dense, vertiginous, and unearthly.',
                              [
                                v('Piano Sonata No. 5', 'RGDyFb6TG4M'),
                                v('Poem of Ecstasy', 'yA8rH7CFXDM'),
                                v('Études Op. 42', 'jwPbx5CXGDQ'),
                              ]),

                            c('rachmaninoff', 'Sergei Rachmaninoff', 1873, 1943, 'LATE_ROMANTIC', 'Russian',
                              'The last great Romantic composer. His piano writing inherits Chopin\'s lyricism; his orchestral sweep inherits Tchaikovsky\'s grandeur. The concertos remain the most performed in the repertoire.',
                              [
                                v('Piano Concerto No. 2', 'rEGOihjqO9w'),
                                v('Rhapsody on a Theme of Paganini', 'kHIGzwc-Yew'),
                                v('Symphony No. 2', 'SJCeRLOa9Oc'),
                                v('Piano Concerto No. 3 (Horowitz)', 'vFskSlMwpg4', 'Vladimir Horowitz'),
                              ],
                              [
                                c('horowitz', 'Vladimir Horowitz', 1903, 1989, 'CONTEMPORARY', 'Russian-American',
                                  'The last great Romantic pianist. A supernatural technique and deeply personal interpretations. His 1965 Carnegie Hall return after a 12-year absence is a legendary recording.',
                                  [
                                    v('Carnegie Hall Return 1965', 'dKFvNVPCmrg'),
                                    v('Scarlatti Sonatas', 'jG5Xts-vwIY'),
                                    v('Rachmaninoff Piano Concerto No. 3', 'vFskSlMwpg4'),
                                  ]),
                              ]),

                            c('einaudi', 'Ludovico Einaudi', 1955, null, 'CONTEMPORARY', 'Italian',
                              'The most-streamed classical composer alive. His meditative, minimal piano works inherit Chopin\'s poetic lyricism while channeling Satie\'s sparse, repetitive aesthetic — bridging Romantic pianism with modern minimalism.',
                              [
                                v('Nuvole Bianche', '_y8evPFDKpA'),
                                v('Experience', 'jM8dCGIm6yc'),
                                v('Una Mattina', 'Dq3PkVJ0p3s'),
                                v('I Giorni', 'fEOJQawykD0'),
                              ],
                              [
                                c('albanese', 'Federico Albanese', 1982, null, 'CONTEMPORARY', 'Italian',
                                  'Berlin-based Italian composer blending classical piano with electronic textures. His cinematic, introspective works continue Einaudi\'s meditative tradition.',
                                  [
                                    v('The Houseboat and the Moon', 'qp0lH0pFKnQ'),
                                    v('Before and Now Seems Infinite', 'IjFPLhGMoTw'),
                                    v('The Blue Hour', '5eYS9xmUwLM'),
                                  ]),
                                c('beving', 'Joep Beving', 1976, null, 'CONTEMPORARY', 'Dutch',
                                  'Dutch pianist who found viral success with his deeply emotional, minimalist piano works. His slow, meditative pieces continue the lineage of Einaudi\'s accessible neo-classical style.',
                                  [
                                    v('Solipsism', '2pUdKvtqRzg'),
                                    v('Awakening', 'RyeLkryZPi4'),
                                    v('Ab Ovo', 'W0txKNHqZPk'),
                                  ]),
                              ]),
                          ]),

                        c('mendelssohn', 'Felix Mendelssohn', 1809, 1847, 'ROMANTIC', 'German',
                          'Child prodigy who received early piano guidance from Hummel. He single-handedly revived Bach\'s St. Matthew Passion in 1829, rescuing Bach from near-oblivion. His lyrical Romanticism and impeccable Classical form make him the most perfectly balanced composer of the 19th century.',
                          [
                            v('Violin Concerto in E minor', 'CRMBCM2-EQE'),
                            v('A Midsummer Night\'s Dream Overture', 'tE6ELY2AhF8'),
                            v('Songs Without Words (selection)', 'RxAUc0M9CyE'),
                            v('Symphony No. 4 "Italian"', 'gy5Ve3338-E'),
                          ]),
                      ]),
                  ]),

                c('beethoven', 'Ludwig van Beethoven', 1770, 1827, 'CLASSICAL', 'German',
                  'Deaf from his forties, he composed his greatest works in silence. He studied with Haydn in Vienna and bridged the Classical and Romantic eras, expanding every form he touched and changing music forever.',
                  [
                    v('Symphony No. 5', '_4IRMYuE1hI'),
                    v('Symphony No. 9 — Ode to Joy', 't3217H8JppI'),
                    v('Moonlight Sonata Op. 27 No. 2', '4Tr0otuiQuU'),
                    v('Piano Concerto No. 5 "Emperor"', 'dJnkqc0-HRk'),
                    v('String Quartet Op. 131', 'oZ-HxaMOm9w'),
                  ],
                  [
                    c('schubert', 'Franz Schubert', 1797, 1828, 'ROMANTIC', 'Austrian',
                      'Beethoven\'s neighbour and greatest admirer. Extraordinarily prolific despite dying at 31, leaving over 600 songs, the unfinished 8th Symphony, and devastating late chamber works.',
                      [
                        v('Ave Maria', 'BZVYW39YH_U'),
                        v('Symphony No. 8 "Unfinished"', 'uPSBMkVCQaY'),
                        v('String Quintet in C — Adagio', 'HLMGDyWKPms'),
                        v('Winterreise (Fischer-Dieskau)', 'EsZGBYpYqkQ', 'Fischer-Dieskau'),
                      ]),

                    c('czerny', 'Carl Czerny', 1791, 1857, 'ROMANTIC', 'Austrian',
                      'Beethoven\'s most devoted pupil. His systematic piano études codified modern technique and shaped every pianist who came after — most crucially his student Franz Liszt.',
                      [v('Piano Studies Op. 299', 'oZYVT5OL5xk')],
                      [
                        c('liszt', 'Franz Liszt', 1811, 1886, 'ROMANTIC', 'Hungarian',
                          'The greatest piano virtuoso of the 19th century. He invented the symphonic poem and the solo recital. His harmonic language pointed directly to Wagner and Debussy.',
                          [
                            v('Hungarian Rhapsody No. 2', 'Ph0MstmLjEQ'),
                            v('Transcendental Étude No. 10', 'A5LN44AhUyg'),
                            v('Piano Sonata in B minor', 'vCVfMBkNprA'),
                            v('Liebestraum No. 3', 'gOBFCYwnFuU'),
                          ],
                          [
                            c('wagner', 'Richard Wagner', 1813, 1883, 'ROMANTIC', 'German',
                              'The most radical force in 19th-century music. His son-in-law to Liszt. He invented the leitmotif and stretched tonality to its limits in Tristan, pointing directly to Schoenberg\'s atonality.',
                              [
                                v('Ride of the Valkyries', 'P_FVRNQj3ec'),
                                v('Tristan und Isolde — Prelude', 'CqP3Avqy3sk'),
                                v('Siegfried\'s Funeral March', 'vGBApbfkwcs'),
                              ],
                              [
                                c('mahler', 'Gustav Mahler', 1860, 1911, 'LATE_ROMANTIC', 'Austrian',
                                  'The last great Romantic symphonist. His vast, turbulent symphonies bridge the 19th and 20th centuries and open the door to the expressionist revolution of Schoenberg.',
                                  [
                                    v('Symphony No. 5 — Adagietto', 'ULpM0dRhKFw'),
                                    v('Symphony No. 9', 'xT4PITtSIXU'),
                                    v('Das Lied von der Erde', 'cHsYQbC3hVA'),
                                  ],
                                  [
                                    c('schoenberg', 'Arnold Schoenberg', 1874, 1951, 'MODERN', 'Austrian',
                                      'Inventor of twelve-tone technique. He took Wagner\'s harmonic dissolution to its logical conclusion — complete atonality — and founded the Second Viennese School.',
                                      [
                                        v('Verklärte Nacht', 'vqODySSxGdc'),
                                        v('Piano Suite Op. 25', 'kW5gP8dVMDs'),
                                      ],
                                      [
                                        c('berg', 'Alban Berg', 1885, 1935, 'MODERN', 'Austrian',
                                          'Schoenberg\'s most lyrical student. He fused twelve-tone technique with late-Romantic expressionism, producing two of the greatest operas of the 20th century.',
                                          [v('Violin Concerto', 'sbLAOFuN2NI'), v('Wozzeck — Opera', 'ohNLp0RKQrI')]),
                                        c('webern', 'Anton Webern', 1883, 1945, 'MODERN', 'Austrian',
                                          'Schoenberg\'s most radical pupil. His concentrated, pointillistic miniatures would detonate like a bomb on the post-war generation — Boulez, Stockhausen, Nono all came from Webern.',
                                          [v('Five Pieces Op. 10', '9N-dvuHpMQI')]),
                                      ]),
                                  ]),

                                c('rstrauss', 'Richard Strauss', 1864, 1949, 'LATE_ROMANTIC', 'German',
                                  'Master of the tone poem and opera. Extended the Wagnerian orchestral vocabulary to its most lavish extreme. His Four Last Songs are among the most beautiful pieces ever written.',
                                  [
                                    v('Also Sprach Zarathustra', 'ETveS23djXM'),
                                    v('Four Last Songs', 'ACN-JZ-iJ4E'),
                                    v('Der Rosenkavalier — Suite', 'Vy_xpOST5Mc'),
                                  ]),

                                c('bruckner', 'Anton Bruckner', 1824, 1896, 'LATE_ROMANTIC', 'Austrian',
                                  'The great cathedral builder of the symphony. A devoted Wagnerian, his massive symphonies — often revised obsessively — represent the apotheosis of Romantic grandeur. Mahler conducted his works and carried his monumental vision forward.',
                                  [
                                    v('Symphony No. 4 "Romantic"', 'gcBg-tXn0fs'),
                                    v('Symphony No. 7 — Adagio', 'uaV3eEJB55c'),
                                    v('Symphony No. 9', 'A_LO6_XK64E'),
                                  ]),
                              ]),

                            c('saint-saens', 'Camille Saint-Saëns', 1835, 1921, 'ROMANTIC', 'French',
                              'Child prodigy, brilliant organist, and champion of French music. Close friend of Liszt, he was the indispensable link between German Romanticism and the French school — and the teacher of Fauré.',
                              [
                                v('Carnival of the Animals', 'RbSXcMKp8mE'),
                                v('Piano Concerto No. 2', 'VJlbBo4yiKE'),
                                v('Symphony No. 3 "Organ"', 'ORDHqyDdmFU'),
                              ],
                              [
                                c('faure', 'Gabriel Fauré', 1845, 1924, 'LATE_ROMANTIC', 'French',
                                  'The subtle master of French song and piano music. His harmonic innovations pointed toward Impressionism. As director of the Paris Conservatoire he taught both Ravel and Nadia Boulanger — making him the ancestor of virtually the entire French and American 20th-century tradition.',
                                  [
                                    v('Requiem', 'MRo3tQH7CqU'),
                                    v('Pavane Op. 50', 'FRSAVAJq7ik'),
                                    v('Nocturnes (complete)', 'J4fkD5p2B64'),
                                  ],
                                  [
                                    c('ravel', 'Maurice Ravel', 1875, 1937, 'IMPRESSIONIST', 'French',
                                      'The supreme craftsman. Studied under Fauré; deeply shaped by Debussy. His impeccable orchestration and bittersweet harmonies represent the pinnacle of French music.',
                                      [
                                        v('Boléro', 'mhhkGyJ092E'),
                                        v('Piano Concerto in G', 'AijVEqq1QGQ'),
                                        v('La Valse', '_WqkAoGC9w0'),
                                        v('Gaspard de la Nuit (Argerich)', '1_fH7J1-HpI', 'Martha Argerich'),
                                      ]),

                                    c('boulanger', 'Nadia Boulanger', 1887, 1979, 'MODERN', 'French',
                                      'The most influential composition teacher of the 20th century. Fauré\'s student at the Paris Conservatoire, she shaped generations: Copland defined American classical music, Piazzolla revolutionized tango, and Glass pioneered minimalism.',
                                      [
                                        v('Lili Boulanger — D\'un soir triste', 'nECZHvMDN_E'),
                                        v('Conducting Monteverdi Madrigals', 'ARBDHrpX_Fg'),
                                      ],
                                      [
                                        c('copland', 'Aaron Copland', 1900, 1990, 'MODERN', 'American',
                                          'The dean of American music. Boulanger\'s first famous American pupil, he forged a distinctly American sound — open harmonies, folk melodies, and wide-open spaces. Appalachian Spring and Fanfare for the Common Man are national treasures.',
                                          [
                                            v('Appalachian Spring', 'hYBS-cMSHIw'),
                                            v('Fanfare for the Common Man', 'FLMVB0B1_Ts'),
                                            v('Rodeo — Hoe-Down', 'LsReWx9XdNs'),
                                            v('Clarinet Concerto', 'DHC_BPt6fMs'),
                                          ],
                                          [
                                            c('bernstein', 'Leonard Bernstein', 1918, 1990, 'MODERN', 'American',
                                              'Composer, conductor, educator — American music\'s renaissance man. West Side Story brought Broadway to symphonic heights. As conductor of the NY Philharmonic, he was America\'s ambassador of classical music.',
                                              [
                                                v('West Side Story — Symphonic Dances', 'bxkOLQzSq88'),
                                                v('Candide — Overture', 'JNi2gflJ0R4'),
                                                v('Chichester Psalms', 'ciCN1CYcaYM'),
                                              ]),
                                          ]),
                                        c('piazzolla', 'Astor Piazzolla', 1921, 1992, 'MODERN', 'Argentine',
                                          'The revolutionary of tango. Boulanger told him to embrace his tango roots, and he did — fusing Buenos Aires\' street music with jazz and classical complexity to create nuevo tango.',
                                          [
                                            v('Libertango', 'POWcnNt0pFw'),
                                            v('Oblivion', 'AcnpMKBdF4s'),
                                            v('Adiós Nonino', 'VTPec8z5vXk'),
                                            v('Four Seasons of Buenos Aires', 'TadxLCMq-2U'),
                                          ]),
                                      ]),
                                  ]),
                              ]),

                            c('grieg', 'Edvard Grieg', 1843, 1907, 'ROMANTIC', 'Norwegian',
                              'The voice of Norway. He distilled Norwegian folk idioms into Liszt\'s Romantic language, creating music of vivid atmosphere and lyrical beauty.',
                              [
                                v('Piano Concerto in A minor', 'MiJLsGqv37E'),
                                v('Peer Gynt Suite No. 1', 'O0tH-fkFRZU'),
                              ]),

                            c('sibelius', 'Jean Sibelius', 1865, 1957, 'LATE_ROMANTIC', 'Finnish',
                              'The voice of Finland. His symphonies chart a journey from late Romanticism to austere economy — the 7th Symphony achieves total concentration in a single movement.',
                              [
                                v('Violin Concerto', 'tBx31CIkE74'),
                                v('Symphony No. 2', 'WNTMFy_Lr-A'),
                                v('Finlandia', 'I8ctfFs_WKQ'),
                              ]),
                          ]),
                      ]),
                  ]),
              ]),
          ]),
      ]),

    // ── PACHELBEL ─────────────────────────────────────────────────────────────
    c('pachelbel', 'Johann Pachelbel', 1653, 1706, 'BAROQUE', 'German',
      'The master of the South German Baroque organ school. He taught Johann Christoph Bach — J.S. Bach\'s older brother and first teacher — directly transmitting the German contrapuntal tradition. His Canon in D is one of the most beloved works in all of classical music.',
      [
        v('Canon in D', 'NlprozGcs98'),
        v('Chaconne in F minor', 'z4MhVFJYtE4'),
        v('Hexachordum Apollinis', '0SYUljJZmOE'),
      ]),

    // ── VIVALDI → BACH ───────────────────────────────────────────────────────
    c('vivaldi', 'Antonio Vivaldi', 1678, 1741, 'BAROQUE', 'Italian',
      'The Red Priest. He transformed the concerto into a dynamic vehicle of contrast. Bach transcribed at least six of his concertos note-for-note, absorbing his structural clarity and melodic vitality.',
      [v('The Four Seasons', 'GRxofEmo3HA'), v('Gloria in D major', 'k1-FJbLkNwY')],
      [
        c('bach', 'Johann Sebastian Bach', 1685, 1750, 'BAROQUE', 'German',
          'The pinnacle of Baroque polyphony and perhaps the greatest composer who ever lived. He absorbed and transcended Vivaldi\'s concerto form, infusing it with incomparable counterpoint and harmonic invention.',
          [
            v('Goldberg Variations (Glenn Gould, 1981)', 'Ah392lnFHxM', 'Glenn Gould'),
            v('Brandenburg Concerto No. 3', 'zssQyiE4s1Y'),
            v('The Well-Tempered Clavier Bk 1', 'EZ-NYKYD5MM', 'Glenn Gould'),
            v('Cello Suite No. 1', '_YPzWFM7miE'),
            v('St. Matthew Passion', 'G0JFqBz0FDg'),
          ],
          [
            c('cpe-bach', 'C.P.E. Bach', 1714, 1788, 'CLASSICAL', 'German',
              'J.S. Bach\'s most famous son. His "empfindsamer Stil" (sensitive style) broke from Baroque formalism and was a direct bridge to the Classical style of Haydn and Mozart.',
              [v('Prussian Sonata No. 1', 'YUVPBqXY3sc'), v('Symphony Wq 183 No. 1', 'p7zR9UrHqiA')]),

            c('glass', 'Philip Glass', 1937, null, 'CONTEMPORARY', 'American',
              'The defining figure of musical minimalism. Though formally trained by Boulanger, his hypnotic, cycling patterns draw deeply from Bach\'s contrapuntal techniques, creating a modern expression of Baroque structure.',
              [
                v('Metamorphosis Two', 'FaovqbcSYqk'),
                v('Koyaanisqatsi', 'jBzXqBJuBME'),
                v('Violin Concerto No. 1', 'OtQOLw_I1LQ'),
                v('Glassworks — Opening', 'n27pMwZ0cDM'),
              ],
              [
                c('max-richter', 'Max Richter', 1966, null, 'CONTEMPORARY', 'German-British',
                  'Neoclassical composer who recomposes the canon. His Recomposed Vivaldi and Sleep project brought classical music to new audiences. His work bridges Glass\'s minimalism with Pärt\'s spiritual tintinnabuli — a meditation on silence and sound.',
                  [
                    v('On the Nature of Daylight', 'rVN1B-tUpgs'),
                    v('Recomposed: Vivaldi - Spring 1', 'FAhSyMl2MjU'),
                    v('Sleep - Dream 3', 'S3hBksAsLz8'),
                  ]),
                c('frahm', 'Nils Frahm', 1982, null, 'CONTEMPORARY', 'German',
                  'Berlin-based pianist and producer who merges acoustic piano with analogue synthesizers. His quiet, slowly evolving textures echo Morton Feldman\'s extended durations while his electronic experimentation channels Brian Eno\'s ambient vision.',
                  [
                    v('Says', 'xLNeZogTsK8'),
                    v('Ambre', 'PtW1n1URWVM'),
                    v('My Friend the Forest', 'BOZIe6eJbQU'),
                  ]),
              ]),
          ]),
      ]),

    // ── SCHUMANN → BRAHMS ────────────────────────────────────────────────────
    c('schumann', 'Robert Schumann', 1810, 1856, 'ROMANTIC', 'German',
      'Poet of the Romantic piano miniature. In 1853 he heard the 20-year-old Brahms and immediately declared him "the one who had to come" — the most celebrated discovery in music history.',
      [
        v('Piano Concerto in A minor', 'Kqpnpf1MDKA'),
        v('Kinderszenen Op. 15', 'CqFJJJVsXaE'),
        v('Dichterliebe Song Cycle', 'k2yNMWf8yiw'),
      ],
      [
        c('brahms', 'Johannes Brahms', 1833, 1897, 'ROMANTIC', 'German',
          'Discovered and championed by Schumann. The great conservative of the 19th century — where Wagner pushed into the future, Brahms looked back to Bach and Beethoven, producing symphonies and chamber music of extraordinary depth.',
          [
            v('Symphony No. 4', 'N3K_kCjhFkE'),
            v('Piano Concerto No. 2', 'WBMRLO_Ymd4'),
            v('Violin Concerto', 'pR9fkTiCkE8'),
            v('Intermezzo Op. 118 No. 2', 'bE5ROgqNVkA'),
          ],
          [
            c('dvorak', 'Antonín Dvořák', 1841, 1904, 'ROMANTIC', 'Czech',
              'Brahms\'s closest friend and greatest advocate. Fused Bohemian folk elements with the Germanic tradition, famously visiting America and composing the "New World" Symphony.',
              [
                v('Symphony No. 9 "New World"', '_WXHkIAeChQ'),
                v('Cello Concerto', 'NqkBIJRrIaI'),
                v('String Quartet "American"', 'sBp2-fHRDcI'),
              ]),
            c('clara-schumann', 'Clara Schumann', 1819, 1896, 'ROMANTIC', 'German',
              'Robert\'s wife and the foremost pianist of the Romantic era. Brahms loved her deeply for decades. A gifted composer herself, largely overlooked until recent scholarship restored her rightful place.',
              [v('Piano Concerto in A minor', 'ZR3ycLhEgAQ'), v('Piano Sonata in G minor', 'k10jGGxGkIo')]),
          ]),
      ]),


    // ── TCHAIKOVSKY → PROKOFIEV ──────────────────────────────────────────────
    c('tchaikovsky', 'Pyotr Tchaikovsky', 1840, 1893, 'ROMANTIC', 'Russian',
      'Russia\'s most beloved composer. His gift for soaring melody and rich orchestration defined Russian Romanticism and set the standard that Prokofiev and Shostakovich would later react against and build upon.',
      [
        v('Piano Concerto No. 1', 'AAMPuRU4BFU'),
        v('Violin Concerto', 'KDntuhCqNW4'),
        v('Swan Lake — Ballet', 'gG5RmfxVLa0'),
        v('1812 Overture', 'VbM4EIEQb6Q'),
      ],
      [
        c('prokofiev', 'Sergei Prokofiev', 1891, 1953, 'MODERN', 'Russian',
          'Heir to Tchaikovsky\'s Russian nationalism and lyrical gift. Crisp, sardonic, and deeply lyrical, he wrote under Soviet repression yet produced some of the most vital and inventive music of the 20th century.',
          [
            v('Piano Concerto No. 3', 'fnmUvSEPOuY'),
            v('Romeo and Juliet — Dance of the Knights', 'rvqKl8ERnW4'),
            v('Symphony No. 1 "Classical"', 'F7kmJBwLGVU'),
          ],
          [
            c('shostakovich', 'Dmitri Shostakovich', 1906, 1975, 'MODERN', 'Russian',
              'The great voice of the Soviet era. His music is a coded record of suffering and survival — alternating between biting satire and the deepest tragedy. Prokofiev was his direct predecessor and rival.',
              [
                v('Symphony No. 5', 'mP-gnCzuapk'),
                v('String Quartet No. 8', 'RXBmKhBjlqo'),
                v('Piano Concerto No. 2', 'e5l5UzuHEMk'),
              ]),
          ]),
      ]),

    // ── SATIE → LES SIX ──────────────────────────────────────────────────────
    c('satie', 'Erik Satie', 1866, 1925, 'IMPRESSIONIST', 'French',
      'The great iconoclast. His Gymnopédies dissolved Romantic rhetoric into pure atmosphere a full decade before Debussy. He championed simplicity and irony against Wagnerian excess and directly inspired the group of young French composers who called themselves Les Six.',
      [
        v('Gymnopédies No. 1', 'S-Xm7s9eGxU'),
        v('Gnossiennes No. 1', 'ka6uDPMCVlw'),
        v('Gymnopédies Nos. 1–3', 'TLNnDmdGBBg'),
      ],
      [
        c('poulenc', 'Francis Poulenc', 1899, 1963, 'MODERN', 'French',
          'The wittiest and most beloved of Les Six, shaped by Satie\'s irreverence and economy. His music swings between sparkling wit and unexpected depth — the Gloria and Stabat Mater are among the most moving choral works of the 20th century.',
          [
            v('Gloria', 'jB5AJ1dB27c'),
            v('Stabat Mater', '0m4kFYiBqgE'),
            v('Concerto for Two Pianos', 'SgHCHibQSmk'),
          ]),

        c('milhaud', 'Darius Milhaud', 1892, 1974, 'MODERN', 'French',
          'The most prolific of Les Six. His jazz-inflected polytonality — as in La Création du monde — was revolutionary. He later taught at Mills College in California where he influenced a generation of American composers.',
          [
            v('La Création du monde', 'LfruHYcnFwM'),
            v('Le Bœuf sur le toit', 'kvRGSSiXoyo'),
          ]),

        c('arnalds', 'Ólafur Arnalds', 1986, null, 'CONTEMPORARY', 'Icelandic',
          'The foremost voice of Nordic neo-classical music. Satie\'s atmospheric simplicity echoes through his delicate fusion of strings, piano, and generative electronics. His music redefined contemporary classical for a new generation.',
          [
            v('Near Light', 'UXNLNqHqkek'),
            v('Only the Winds', 'GvoyPQDOgso'),
            v('re:member — undone', 'rMzuBgSPh8Y'),
            v('Saman', 'GYy_KzAn5vU'),
          ],
          [
            c('rani', 'Hania Rani', 1990, null, 'CONTEMPORARY', 'Polish',
              'Warsaw-born pianist and composer whose introspective, minimalist works blend classical piano with electronic textures. Her atmospheric style continues Arnalds\'s fusion of acoustic and electronic worlds.',
              [
                v('Eden', 'Nc-mYpOBkvY'),
                v('Glass', 'P1-FkR24mMk'),
                v('F Major', 'q8Y7-Nprlo8'),
              ]),
            c('cipa', 'Carlos Cipa', 1985, null, 'CONTEMPORARY', 'German',
              'Munich-based pianist known for his ethereal, meditative compositions. His delicate touch and atmospheric soundscapes carry forward the neo-classical tradition of Arnalds.',
              [
                v('Correlations', 'HDq3j_H_K-0'),
                v('The Raft', 'k9-_7HhBbsI'),
                v('Debayashi', 'O3k7z3FHAX8'),
              ]),
          ]),
      ]),

    // ── DEBUSSY → MESSIAEN → BOULEZ ──────────────────────────────────────────
    c('debussy', 'Claude Debussy', 1862, 1918, 'IMPRESSIONIST', 'French',
      'The founder of musical Impressionism. Trained at the Paris Conservatoire under Ernest Guiraud, he was profoundly shaped by Satie\'s simplicity, Wagner\'s harmony, and Javanese gamelan. He dissolved the iron structures of tonal harmony in favour of colour, atmosphere, and suggestion — opening the door to everything that followed.',
      [
        v('Clair de Lune', 'CvFH_6DNRCY'),
        v('La Mer', 'j5oJt6FVilQ'),
        v('Prélude à l\'après-midi d\'un faune', 'tKVmKgvSCIE'),
        v('Préludes Book 1 (Gieseking)', 'G3-4VFkLUAY', 'Walter Gieseking'),
      ],
      [
        c('messiaen', 'Olivier Messiaen', 1908, 1992, 'MODERN', 'French',
          'The great mystic of 20th-century music. Debussy\'s harmonic colour merged with Catholic theology, birdsong, and Hindu rhythms to create a wholly unique language. His teaching at the Paris Conservatoire shaped the entire post-war avant-garde.',
          [
            v('Quartet for the End of Time', 'meNuFgOq9rs'),
            v('Turangalîla Symphony', 'ZLJtVuWvD7w'),
            v('Vingt Regards — Regard de l\'Enfant-Jésus', 'Dau5jLWzRY8'),
          ],
          [
            c('boulez', 'Pierre Boulez', 1925, 2016, 'CONTEMPORARY', 'French',
              'Messiaen\'s most famous student. He pushed serialism to its extreme limit in works of icy complexity, then became the dominant conductor of his era — reshaping how orchestras performed the 20th-century repertoire.',
              [
                v('Le Marteau sans maître', 'iDMDFZVmQUE'),
                v('Notations I–IV (conductor)', 'QE4MBFDwRgA'),
              ]),
          ]),

        c('tiersen', 'Yann Tiersen', 1970, null, 'CONTEMPORARY', 'French',
          'Breton composer best known for the Amélie soundtrack. His impressionistic piano miniatures and layered orchestrations carry forward Debussy\'s atmospheric sensibility into contemporary film and concert music.',
          [
            v('Comptine d\'un autre été', 'H2-1u8xvk54'),
            v('La Valse d\'Amélie', 'WPjMTr6wuSM'),
            v('Sur le fil', 'cvYYqT_uP-w'),
            v('Porz Goret', '6GnLa0K5vc0'),
          ],
          [
            c('rakotondrabe', 'Gaël Rakotondrabe', 1982, null, 'CONTEMPORARY', 'French-Malagasy',
              'Paris-based pianist and composer known for his introspective, minimalist pieces. His atmospheric works continue Tiersen\'s blend of classical and cinematic sensibilities.',
              [
                v('Notre-Dame', 'J8c7K1QmRQo'),
                v('Clair-Obscur', 'mlADwxhT8Zs'),
              ]),
          ]),
      ]),

    // ── THE RUSSIAN FIVE (Mighty Handful) → STRAVINSKY ───────────────────────
    c('balakirev', 'Mily Balakirev', 1837, 1910, 'ROMANTIC', 'Russian',
      'The founder and spiritual leader of "The Five" — the group of Russian nationalist composers who forged a distinctly Russian musical identity against Western European influence. He mentored Mussorgsky, Borodin, and Rimsky-Korsakov.',
      [
        v('Islamey — Oriental Fantasy', 'k0XoRKpV_Tg'),
        v('Symphony No. 1 in C', 'jF1JqH2k8ZE'),
      ],
      [
        c('mussorgsky', 'Modest Mussorgsky', 1839, 1881, 'ROMANTIC', 'Russian',
          'The most original voice of The Five. His raw, unpolished genius in Boris Godunov and Pictures at an Exhibition broke all conventions. He died tragically at 42, leaving many works unfinished.',
          [
            v('Pictures at an Exhibition', 'FsvpFU7KY7E'),
            v('Night on Bald Mountain', 'iCEDfZgDPS8'),
            v('Boris Godunov — Coronation Scene', 'r0BNnMoO_g8'),
          ]),
        c('borodin', 'Alexander Borodin', 1833, 1887, 'ROMANTIC', 'Russian',
          'A chemist by profession who composed in his spare hours. His Polovtsian Dances and two string quartets are masterpieces of Russian Romanticism. His unfinished opera Prince Igor was completed by Rimsky-Korsakov.',
          [
            v('Polovtsian Dances', 'wiexn6O9To4'),
            v('String Quartet No. 2 — Nocturne', 'bNJ3Kf0O2Lw'),
            v('In the Steppes of Central Asia', 'UepBA19ocpE'),
          ]),
        c('rimsky', 'Nikolai Rimsky-Korsakov', 1844, 1908, 'ROMANTIC', 'Russian',
          'The master orchestrator of The Five and Russia\'s greatest composition teacher. He completed and edited works by Mussorgsky and Borodin. Stravinsky studied under him for six years; his Principles of Orchestration remains a standard textbook.',
          [
            v('Scheherazade Op. 35', 'SQNymNaTr-Y'),
            v('Flight of the Bumblebee', 'ym5QGKQN0I4'),
            v('Capriccio Espagnol', 'eLVAlDqDEDI'),
          ],
          [
            c('stravinsky', 'Igor Stravinsky', 1882, 1971, 'MODERN', 'Russian',
              'Rimsky-Korsakov\'s most famous pupil and the most stylistically versatile composer of the 20th century — from Russian nationalist to Diaghilev\'s revolutionary to neoclassicist to serialist. The Rite of Spring\'s rhythmic violence changed music irrevocably.',
              [
                v('The Rite of Spring', '5UJOaGIhG7A'),
                v('The Firebird Suite', '3tqhBCM6HxE'),
                v('Petrushka', 'cEfHe8_wd4k'),
                v('Symphony of Psalms', 'FGNBrHFQJtY'),
              ]),
          ]),
      ]),

    // ── ENGLISH SCHOOL: PURCELL → ELGAR → BRITTEN ────────────────────────────
    c('purcell', 'Henry Purcell', 1659, 1695, 'BAROQUE', 'English',
      'England\'s greatest native composer until Elgar. His Dido and Aeneas contains one of opera\'s most heartbreaking arias. His death at 36 left English music in the shadow of imports like Handel for two centuries.',
      [
        v('Dido & Aeneas — When I am laid', 'wCY-47iwj5Q'),
        v('Music for the Funeral of Queen Mary', 'E5I82DIRtmE'),
        v('The Fairy Queen — Suite', 'aXQRDwPTU_4'),
      ],
      [
        c('elgar', 'Edward Elgar', 1857, 1934, 'LATE_ROMANTIC', 'British',
          'The first great English composer since Purcell. Self-taught from the provinces, he created the Enigma Variations and a cello concerto of overwhelming nobility. He gave England its voice in the late Romantic era.',
          [
            v('Enigma Variations', 'sUgoBb8m1eE'),
            v('Cello Concerto', 'OPhkZW_jwc0'),
            v('Pomp and Circumstance No. 1', 'moL4MkJ-aLk'),
          ],
          [
            c('vaughan-williams', 'Ralph Vaughan Williams', 1872, 1958, 'MODERN', 'British',
              'The pastoral voice of England. Studied with Ravel in Paris, but his music draws on English folk song and Tudor polyphony. His nine symphonies and The Lark Ascending define an English musical identity.',
              [
                v('The Lark Ascending', 'ZR2JlDnT2l8'),
                v('Fantasia on a Theme by Thomas Tallis', 'qIhCEMx8V4w'),
                v('Symphony No. 5', 'lSkg8L6Y1qA'),
              ]),
            c('britten', 'Benjamin Britten', 1913, 1976, 'MODERN', 'British',
              'The greatest British composer since Purcell. His operas — Peter Grimes, Billy Budd, The Turn of the Screw — revived English opera after three centuries. His War Requiem is one of the 20th century\'s most powerful antiwar statements.',
              [
                v('Peter Grimes — Four Sea Interludes', 'dGeDfU6BxXI'),
                v('War Requiem — Dies Irae', 'B0sIu8K_cJ8'),
                v('The Young Person\'s Guide to the Orchestra', 'HrNu_cJ1BVk'),
                v('Simple Symphony', 'LdBapzNTYtQ'),
              ]),
          ]),
      ]),

    // ── PAGANINI (Virtuoso phenomenon) ───────────────────────────────────────
    c('paganini', 'Niccolò Paganini', 1782, 1840, 'ROMANTIC', 'Italian',
      'The devil\'s violinist. His supernatural virtuosity so astonished Liszt that the young pianist vowed to become the Paganini of the piano — and did. Schumann, Brahms, and Rachmaninoff all wrote variations on his themes.',
      [
        v('24 Caprices — No. 24', 'OhVjS5Lraxc'),
        v('Violin Concerto No. 1', 'O9i1rfJOHngs'),
        v('La Campanella (original violin)', '4K0w6v7LNYQ'),
      ]),

    // ── BERLIOZ (French Romantic orchestration) ──────────────────────────────
    c('berlioz', 'Hector Berlioz', 1803, 1869, 'ROMANTIC', 'French',
      'The revolutionary orchestrator. His Symphonie fantastique (1830) — written for a 150-piece orchestra — invented program music and modern orchestration simultaneously. His Treatise on Instrumentation taught generations how to write for orchestra.',
      [
        v('Symphonie fantastique', 'sK4dz6Gbcdk'),
        v('Harold in Italy', 'aV-XnB3j_Ko'),
        v('Roman Carnival Overture', 'zPxGnWnvdtE'),
        v('Requiem — Dies Irae', 'lCQwzFh0yxg'),
      ]),

    // ── AMERICAN SCHOOL: GERSHWIN → FILM COMPOSERS ───────────────────────────
    c('gershwin', 'George Gershwin', 1898, 1937, 'MODERN', 'American',
      'He made jazz symphonic. Rhapsody in Blue fused classical form with jazz harmony; Porgy and Bess is America\'s great opera. He died at 38 of a brain tumor, at the height of his powers.',
      [
        v('Rhapsody in Blue', 'ynEOo28lsbc'),
        v('An American in Paris', 'KVofPrmO2X0'),
        v('Porgy and Bess — Summertime', 'O7-Qa92Rrvs'),
        v('Piano Concerto in F', 'WYi2ZRcX5J4'),
      ],
      [
        c('john-williams', 'John Williams', 1932, null, 'CONTEMPORARY', 'American',
          'The most successful film composer in history. Star Wars, Indiana Jones, Harry Potter, Schindler\'s List — his themes have become part of global culture. A direct heir to the great Romantic orchestrators through the American studio system.',
          [
            v('Star Wars — Main Theme', 'iH6a1iYQ0GA'),
            v('Schindler\'s List — Theme', 'VvKjpGP6P5Y'),
            v('Jurassic Park — Theme', 'D8zlUUrFK-M'),
            v('Harry Potter — Hedwig\'s Theme', 'uGrEjjHInEA'),
          ]),
      ]),

    // ── VILLA-LOBOS (Brazil) ─────────────────────────────────────────────────
    c('villa-lobos', 'Heitor Villa-Lobos', 1887, 1959, 'MODERN', 'Brazilian',
      'The voice of Brazil. Largely self-taught, he fused Brazilian folk music, Bach (in his Bachianas Brasileiras), and French Impressionism into over 2,000 works. He made Brazil a presence on the world musical stage.',
      [
        v('Bachianas Brasileiras No. 5', 'jJo0FG1dR3o'),
        v('Bachianas Brasileiras No. 2 — Little Train', 'eQRoBdGpJ_I'),
        v('Guitar Concerto', 'PDTA9TjKXvk'),
        v('Prelude No. 1 for Guitar', '_9LFsqsn4Kg'),
      ]),

    // ── POLISH AVANT-GARDE: PENDERECKI & GÓRECKI ─────────────────────────────
    c('penderecki', 'Krzysztof Penderecki', 1933, 2020, 'CONTEMPORARY', 'Polish',
      'The master of controlled chaos. His Threnody for the Victims of Hiroshima (1960) opened new worlds of orchestral texture. Later works like the Polish Requiem returned to a more Romantic grandeur. Kubrick, Lynch, and Scorsese have used his music.',
      [
        v('Threnody for Hiroshima', 'Dp3BlFZWJNA'),
        v('St. Luke Passion', 'M0-l8bBPmWo'),
        v('Polymorphia', 'BLvFZrSP8zE'),
      ],
      [
        c('gorecki', 'Henryk Górecki', 1933, 2010, 'CONTEMPORARY', 'Polish',
          'From avant-garde to holy minimalism. His Symphony No. 3 (Symphony of Sorrowful Songs) became a phenomenon in 1992, reaching millions with its meditative simplicity on the theme of maternal loss.',
          [
            v('Symphony No. 3 — Mvt. 2', '_7qdFg4tGwg'),
            v('Totus Tuus', 'NDBj8NVP7EM'),
          ]),
      ]),

    // ── D. SCARLATTI (Baroque keyboard) ──────────────────────────────────────
    c('d-scarlatti', 'Domenico Scarlatti', 1685, 1757, 'BAROQUE', 'Italian',
      'Contemporary of Bach and Handel but utterly unlike them. His 555 keyboard sonatas — written for the Spanish queen — are short, brilliant, and endlessly inventive, anticipating Romantic pianism by a century.',
      [
        v('Sonata K. 141 in D minor', '7bpqAGMO2tU'),
        v('Sonata K. 380 in E major', 'K9Lm9D-xdMg'),
        v('Sonata K. 9 (Pastoral)', 'z0a7VN7S5Ks'),
        v('30 Sonatas (Horowitz)', 'jG5Xts-vwIY', 'Vladimir Horowitz'),
      ]),

    // ── BARTÓK → LIGETI ──────────────────────────────────────────────────────
    c('bartok', 'Béla Bartók', 1881, 1945, 'MODERN', 'Hungarian',
      'The great ethnomusicologist-composer. He fused Hungarian and Romanian folk music with the most advanced modernist techniques of his time. Ligeti, his fellow Hungarian, explicitly named him as a primary influence.',
      [
        v('Piano Concerto No. 3', 'YcnX8GhVBDk'),
        v('Music for Strings, Percussion & Celesta', 'DixMhDsRxG8'),
        v('String Quartet No. 4', 'a4dCGKdU8_4'),
      ],
      [
        c('ligeti', 'György Ligeti', 1923, 2006, 'CONTEMPORARY', 'Hungarian',
          'The great colouristic innovator. Escaping Hungary after 1956, he created micropolyphony — dense clouds of sound where rhythm and harmony blur. Kubrick used his music in 2001: A Space Odyssey. His piano Études are among the most demanding ever written.',
          [
            v('Atmosphères', 'sjDfBLwJjZQ'),
            v('Piano Études — Désordre', 'Ol7pFpjxfEo'),
            v('Lontano', 'kB3RZCZEqo8'),
          ]),
      ]),

    // ── ARVO PÄRT → DUSTIN O'HALLORAN ─────────────────────────────────────────
    c('part', 'Arvo Pärt', 1935, null, 'CONTEMPORARY', 'Estonian',
      'Creator of tintinnabuli — a technique of monastic simplicity where a melody voice and a triad voice move in strict counterpoint. After years of silence, his music of spiritual stillness speaks directly to the soul.',
      [
        v('Spiegel im Spiegel', 'TJ6Mzvh3XCc'),
        v('Für Alina', '1hlzZB_Nzf0'),
        v('Tabula Rasa', 'Knj3UdKdGMU'),
        v('Fratres', 'nqAZhkEZpDQ'),
      ],
      [
        c('ohalloran', 'Dustin O\'Halloran', 1971, null, 'CONTEMPORARY', 'American',
          'Los Angeles-born pianist and composer known for his intimate, contemplative piano works. His stripped-back aesthetic and spiritual depth carry forward Pärt\'s meditative tradition. He has scored numerous films including Lion and Transparent.',
          [
            v('Opus 23', 'h9gqkWxnrSY'),
            v('We Move Lightly', 'CswAFPpvZPY'),
            v('Opus 37', 'VvxsJRiDe3s'),
            v('An Ending, a Beginning', 'TJI6g0eR8Fo'),
          ],
          [
            c('howard', 'Luke Howard', 1986, null, 'CONTEMPORARY', 'Australian',
              'Melbourne-based pianist and composer whose quietly powerful works blend classical piano with ambient textures. His meditative style continues the spiritual lineage of Pärt and O\'Halloran.',
              [
                v('St Kilda', 'LvkqWTL3MQE'),
                v('Atlas', 'kj0i8E6vC5g'),
                v('The Sand That Ate The Sea', 'sDXKiVs8LxY'),
              ]),
          ]),
      ]),

    // ── REICH → ADAMS ────────────────────────────────────────────────────────
    c('reich', 'Steve Reich', 1936, null, 'CONTEMPORARY', 'American',
      'Pioneer of phasing and process music. His tape-loop experiments evolved into a rigorous compositional method. He directly taught and inspired John Adams, the most-performed living American composer.',
      [
        v('Music for 18 Musicians', 'PBiU1wMEPNk'),
        v('Different Trains', 'tCpxC8lmkT0'),
        v('Electric Counterpoint', 'vugqRAX7xQE'),
      ],
      [
        c('adams', 'John Adams', 1947, null, 'CONTEMPORARY', 'American',
          'Post-minimalist. He brought narrative, lyricism, and harmonic richness back to a language stripped bare by Reich and Glass. Nixon in China and Doctor Atomic are landmarks of late 20th-century opera.',
          [
            v('Shaker Loops', 'eiLyfZR1wnI'),
            v('Short Ride in a Fast Machine', 'dpUyQkxD09A'),
            v('Doctor Atomic Symphony', 'XNzRMZflbNE'),
          ]),
      ]),

    // ── FELDMAN (Experimental / Extended Duration) ───────────────────────────
    c('feldman', 'Morton Feldman', 1926, 1987, 'MODERN', 'American',
      'Pioneer of indeterminate music and extended durations. His quiet, slowly evolving works — some lasting six hours — explored the threshold of audibility. His influence echoes through the ambient piano scene, notably Nils Frahm.',
      [
        v('Rothko Chapel', 'wJMVGYbBz8M'),
        v('For Philip Guston', 'XHkKu5aVEgw'),
        v('Triadic Memories', 'o4SzWBAGj1E'),
      ]),

    // ── ENO (Ambient Pioneer) ────────────────────────────────────────────────
    c('eno', 'Brian Eno', 1948, null, 'CONTEMPORARY', 'British',
      'Inventor of ambient music. Though rooted in rock and electronic experimentation, his Music for Airports (1978) created a new genre that profoundly shaped the contemporary neo-classical piano scene.',
      [
        v('Music for Airports 1/1', 'vNwYtllyt3Q'),
        v('An Ending (Ascent)', 'aKw5mbcE7VY'),
        v('Deep Blue Day', 'nSKsWHzRsHw'),
      ]),

    // ── GREAT PERFORMERS ─────────────────────────────────────────────────────
    c('gould', 'Glenn Gould', 1932, 1982, 'CONTEMPORARY', 'Canadian',
      'The most idiosyncratic and influential pianist of the 20th century. He retired from concert at 31, recording studio performances of uncanny intellectual depth. His 1981 Goldberg Variations is one of the great artistic farewells.',
      [
        v('Goldberg Variations 1981', 'Ah392lnFHxM'),
        v('Bach WTC Book 1', 'EZ-NYKYD5MM'),
        v('Beethoven Sonata Op. 109', 'xvlJMR-NLEI'),
      ]),

    c('gieseking', 'Walter Gieseking', 1895, 1956, 'CONTEMPORARY', 'German',
      'Legendary for his feather-light touch and extraordinary tonal palette. His recordings of Debussy and Ravel remain unsurpassed.',
      [
        v('Debussy Préludes Book 1', 'G3-4VFkLUAY'),
        v('Mozart Piano Sonatas', 'QCwHNiKWiGs'),
      ]),

    c('richter', 'Sviatoslav Richter', 1915, 1997, 'CONTEMPORARY', 'Russian',
      'Titan of 20th-century piano. A vast repertoire performed at the highest level. His student Zimerman represents the continuation of this uncompromising tradition.',
      [
        v('Schubert Wanderer Fantasy', 'OmQBnMjcKo8'),
        v('Beethoven "Hammerklavier" Sonata', 'pJnFdV8LXYY'),
        v('Prokofiev Piano Concerto No. 5', 'PoECd9BXK6A'),
      ],
      [
        c('zimerman', 'Krystian Zimerman', 1956, null, 'CONTEMPORARY', 'Polish',
          'One of the supreme pianists of the modern era. A consummate perfectionist in the Richter mould — his Chopin and Brahms are considered definitive.',
          [
            v('Brahms Piano Concerto No. 2', 'WBMRLO_Ymd4'),
            v('Chopin Piano Concerto No. 1', 'cBDl_lH_B40'),
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
          'The prodigy of the current generation. Combines supernatural technique with rare musical sensitivity. Argerich called him "the most amazing pianist I have heard in my life."',
          [
            v('Chopin Études', 'SjnKR8V0v60'),
            v('Rachmaninoff Piano Concerto No. 3', 'YL-RdSV3xag'),
            v('Liszt Piano Sonata in B minor', 'vCVfMBkNprA'),
          ]),
      ]),

    c('pollini', 'Maurizio Pollini', 1942, 2024, 'CONTEMPORARY', 'Italian',
      'The supreme intellectual pianist. Crystal-clear technique and an architecture of steely logic made his Chopin and Beethoven benchmarks for all time. He championed the Schoenberg, Boulez, and Nono alongside the Classical canon.',
      [
        v('Chopin 24 Études', 'atXTEEFvFNA'),
        v('Beethoven Piano Sonatas (late)', 'oZ-HxaMOm9w'),
        v('Schoenberg Piano Suite Op. 25', 'kW5gP8dVMDs'),
      ]),
  ],
};

// ─── Flat list for timeline ────────────────────────────────────────────────────
export function flatComposers() {
  const result = [];
  function walk(node, parentId = null) {
    if (node.period) {
      result.push({
        ...node,
        parentId,
        childrenIds: (node.children || []).filter(c => c.period).map(c => c.id),
      });
    }
    if (node.children) node.children.forEach(c => walk(c, node.period ? node.id : parentId));
  }
  treeData.children.forEach(c => walk(c, null));
  return result.sort((a, b) => a.born - b.born);
}

// ─── Get ancestors (teachers) of a composer ────────────────────────────────────
function getAncestors(composerId) {
  const ancestors = [];
  function walk(node, path) {
    if (node.id === composerId) {
      ancestors.push(...path);
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (walk(child, [...path, node])) return true;
      }
    }
    return false;
  }
  treeData.children.forEach(child => walk(child, []));
  return ancestors.filter(a => a.period); // only actual composers
}

// ─── Get a composer node by ID (with full subtree) ─────────────────────────────
function getComposerNode(composerId) {
  function find(node) {
    if (node.id === composerId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = find(child);
        if (found) return found;
      }
    }
    return null;
  }
  for (const child of treeData.children) {
    const found = find(child);
    if (found) return found;
  }
  return null;
}

// ─── Count musical descendants of a composer (recursive children with period) ──
export function countDescendants(composerId) {
  const node = getComposerNode(composerId);
  if (!node) return 0;
  function count(n) {
    if (!n.children) return 0;
    return n.children.reduce((acc, child) => {
      return acc + (child.period ? 1 : 0) + count(child);
    }, 0);
  }
  return count(node);
}

// ─── Get Wikipedia article name for a composer ─────────────────────────────────
export function getWikipediaName(composer) {
  // Override map for names that differ from Wikipedia article titles
  const overrides = {
    'cpe-bach': 'Carl_Philipp_Emanuel_Bach',
    'handel': 'George_Frideric_Handel',
    'vivaldi': 'Antonio_Vivaldi',
    'bach': 'Johann_Sebastian_Bach',
    'mozart': 'Wolfgang_Amadeus_Mozart',
    'beethoven': 'Ludwig_van_Beethoven',
    'haydn': 'Joseph_Haydn',
    'chopin': 'Frédéric_Chopin',
    'liszt': 'Franz_Liszt',
    'brahms': 'Johannes_Brahms',
    'wagner': 'Richard_Wagner',
    'tchaikovsky': 'Pyotr_Ilyich_Tchaikovsky',
    'debussy': 'Claude_Debussy',
    'ravel': 'Maurice_Ravel',
    'mahler': 'Gustav_Mahler',
    'strauss-r': 'Richard_Strauss',
    'schoenberg': 'Arnold_Schoenberg',
    'stravinsky': 'Igor_Stravinsky',
    'bartok': 'Béla_Bartók',
    'rachmaninoff': 'Sergei_Rachmaninoff',
    'scriabin': 'Alexander_Scriabin',
    'satie': 'Erik_Satie',
    'puccini': 'Giacomo_Puccini',
    'verdi': 'Giuseppe_Verdi',
    'max-richter': 'Max_Richter',
    'nils-frahm': 'Nils_Frahm',
    'olafur-arnalds': 'Ólafur_Arnalds',
    'glassp': 'Philip_Glass',
  };
  if (overrides[composer.id]) return overrides[composer.id];
  return composer.name.replace(/ /g, '_');
}

// ─── Build lineage tree: ancestors path + selected + descendants ───────────────
export function buildLineageTree(composerId) {
  const ancestors = getAncestors(composerId);
  const selected = getComposerNode(composerId);
  if (!selected) return null;

  // Build tree from top ancestor down to selected, then include selected's children
  if (ancestors.length === 0) {
    // No ancestors, just return selected with its children
    return {
      ...selected,
      children: selected.children ? [...selected.children] : []
    };
  }

  // Build from top ancestor
  const root = { ...ancestors[0], children: [] };
  let current = root;

  for (let i = 1; i < ancestors.length; i++) {
    const next = { ...ancestors[i], children: [] };
    current.children = [next];
    current = next;
  }

  // Add selected as child of last ancestor
  current.children = [{
    ...selected,
    children: selected.children ? [...selected.children] : []
  }];

  return root;
}
