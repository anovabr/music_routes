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

    // ── MONTEVERDI → HANDEL → HAYDN → CLASSICAL LINEAGE ──────────────────────
    c('monteverdi', 'Claudio Monteverdi', 1567, 1643, 'BAROQUE', 'Italian',
      'The inventor of opera. His L\'Orfeo (1607) launched an entirely new art form. His radical text-setting and harmonic daring mark the birth of the Baroque era.',
      [v("L'Orfeo — Opera", 'ARBDHrpX_Fg'), v('Vespers of 1610', 'fFmKlkX_JRA')],
      [
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
                                      'The most influential composition teacher of the 20th century. Fauré\'s student at the Paris Conservatoire, she later shaped an extraordinary roster: Copland, Piazzolla, Barenboim — and Philip Glass, through whom her lineage reaches minimalism and beyond.',
                                      [
                                        v('Lili Boulanger — D\'un soir triste', 'nECZHvMDN_E'),
                                        v('Conducting Monteverdi Madrigals', 'ARBDHrpX_Fg'),
                                      ],
                                      [
                                        c('glass', 'Philip Glass', 1937, null, 'CONTEMPORARY', 'American',
                                          'Studied under Nadia Boulanger in Paris and was transformed by Ravi Shankar\'s rhythmic cycles. The defining figure of musical minimalism — his hypnotic, cycling patterns permeated concert halls, operas, and film scores worldwide.',
                                          [
                                            v('Metamorphosis Two', 'FaovqbcSYqk'),
                                            v('Koyaanisqatsi', 'jBzXqBJuBME'),
                                            v('Violin Concerto No. 1', 'OtQOLw_I1LQ'),
                                          ],
                                          [
                                            c('einaudi', 'Ludovico Einaudi', 1955, null, 'CONTEMPORARY', 'Italian',
                                              'The most-streamed classical composer alive. His meditative, minimal piano works sit at the intersection of classical, ambient and contemporary — directly shaped by Glass\'s minimalism and Pärt\'s stillness.',
                                              [
                                                v('Nuvole Bianche', '_y8evPFDKpA'),
                                                v('Experience', 'jM8dCGIm6yc'),
                                                v('Una Mattina', 'Dq3PkVJ0p3s'),
                                              ]),
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
      ]),

    // ── RIMSKY-KORSAKOV → STRAVINSKY ─────────────────────────────────────────
    c('rimsky', 'Nikolai Rimsky-Korsakov', 1844, 1908, 'ROMANTIC', 'Russian',
      'The master orchestrator of the Russian nationalist school and the greatest composition teacher Russia produced. Stravinsky studied privately under him for six years. His Principles of Orchestration became the standard textbook of the art.',
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

    // ── ARVO PÄRT → ÓLAFUR ARNALDS ───────────────────────────────────────────
    c('part', 'Arvo Pärt', 1935, null, 'CONTEMPORARY', 'Estonian',
      'Creator of tintinnabuli — a technique of monastic simplicity where a melody voice and a triad voice move in strict counterpoint. After years of silence, his music of spiritual stillness speaks directly to the soul. Ólafur Arnalds explicitly cites him as a founding influence.',
      [
        v('Spiegel im Spiegel', 'TJ6Mzvh3XCc'),
        v('Für Alina', '1hlzZB_Nzf0'),
        v('Tabula Rasa', 'Knj3UdKdGMU'),
      ],
      [
        c('arnalds', 'Ólafur Arnalds', 1986, null, 'CONTEMPORARY', 'Icelandic',
          'The foremost voice of Nordic neo-classical music. He fuses strings, piano, and generative electronics in a delicate world deeply shaped by Pärt\'s tintinnabuli and the Icelandic landscape. His music redefined the boundaries of contemporary classical.',
          [
            v('Near Light', 'UXNLNqHqkek'),
            v('Only the Winds', 'GvoyPQDOgso'),
            v('re:member — undone', 'rMzuBgSPh8Y'),
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
  function walk(node) {
    if (node.period) result.push(node);
    if (node.children) node.children.forEach(walk);
  }
  treeData.children.forEach(walk);
  return result.sort((a, b) => a.born - b.born);
}
