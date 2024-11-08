import redis

# Create a Redis connection
r = redis.Redis(host='localhost', port=14003, db=0)

# Push a message onto the queue
r.lpush('scoring_queue', """
{
    "id": "E00004",
    "title": "Ujian Sistem Informasi Terbaru",
    "questions": [
        {
            "content": "Apa yang dimaksud dengan Big Data dan bagaimana pengaruhnya terhadap pengembangan sistem informasi?",
            "answer_key": "Big Data merujuk pada kumpulan data yang sangat besar, kompleks, dan beragam yang sulit diolah menggunakan metode tradisional. Pengaruhnya terhadap pengembangan sistem informasi adalah perluasan kemampuan untuk mengelola, menganalisis, dan memanfaatkan data dalam skala besar, memungkinkan pengambilan keputusan yang lebih baik.",
            "keyword": [
                "Big Data",
                "Pengembangan Sistem Informasi",
                "Analisis Data"
            ],
            "responses": [
                {
                    "user_id": "U1",
                    "content": "Big Data adalah harta karun informasi. Dengan alat yang tepat, kita dapat mengekstrak wawasan berharga dari volume data yang besar ini."
                },
                {
                    "user_id": "U2",
                    "content": "Pengembangan sistem informasi saat ini harus mempertimbangkan Big Data. Ini membuka peluang baru untuk bisnis dan penelitian."
                },
                {
                    "user_id": "U3",
                    "content": "Analisis Big Data adalah kunci untuk pengambilan keputusan yang lebih cerdas. Ini membantu organisasi dalam mengidentifikasi tren dan peluang yang mungkin terlewatkan sebelumnya."
                },
                {
                    "user_id": "U4",
                    "content": "Penting untuk memiliki infrastruktur yang kuat untuk menangani Big Data. Tanpa itu, kita mungkin kehilangan data yang berharga."
                },
                {
                    "user_id": "U5",
                    "content": "Big Data mengubah cara kita memandang informasi. Ini tidak hanya tentang kuantitas data, tetapi juga kualitas dan kemampuan untuk menggali makna darinya."
                },
                {
                    "user_id": "U6",
                    "content": "Saat ini, Big Data adalah aset yang sangat berharga dalam dunia bisnis. Ini membantu dalam pemahaman pelanggan dan pasar dengan lebih baik."
                },
                {
                    "user_id": "U7",
                    "content": "Pengembangan sistem informasi harus mengintegrasikan alat dan teknik untuk mengelola Big Data. Ini memerlukan keahlian khusus."
                },
                {
                    "user_id": "U8",
                    "content": "Big Data dapat menghasilkan wawasan yang sangat berharga, tetapi juga bisa menjadi tantangan teknis. Perlu pendekatan yang tepat untuk mengelola dan memanfaatkannya."
                },
                {
                    "user_id": "U9",
                    "content": "Pengembangan sistem informasi yang sukses harus menggabungkan Big Data dalam strateginya. Ini adalah sumber daya yang tidak boleh diabaikan."
                },
                {
                    "user_id": "U10",
                    "content": "Pengembangan sistem informasi yang responsif harus dapat menangani arus data besar yang terus bertambah dengan efisien."
                }
            ]
        },
        {
            "content": "Apa yang dimaksud dengan algoritma Machine Learning dan bagaimana digunakan dalam pengembangan sistem informasi?",
            "answer_key": "Algoritma Machine Learning adalah metode komputasi yang memungkinkan sistem untuk belajar dari data dan meningkatkan kinerjanya seiring waktu tanpa pemrograman ekspisit. Ini digunakan dalam pengembangan sistem informasi untuk membuat sistem yang lebih cerdas dan dapat mengambil keputusan berdasarkan data.",
            "keyword": [
                "Machine Learning",
                "Pengembangan Sistem Informasi",
                "Pemrograman Ekspisit"
            ],
            "responses": [
                {
                    "user_id": "V1",
                    "content": "Machine Learning adalah cabang penting dari kecerdasan buatan. Ini memungkinkan sistem untuk mengenali pola dan membuat prediksi berdasarkan data historis."
                },
                {
                    "user_id": "V2",
                    "content": "Dalam pengembangan sistem informasi, Machine Learning dapat digunakan untuk meningkatkan otomatisasi tugas-tugas yang memerlukan kecerdasan manusia."
                },
                {
                    "user_id": "V3",
                    "content": "Machine Learning membantu sistem informasi dalam menghadapi data yang kompleks dan berubah-ubah. Ini adalah alat yang sangat berguna untuk analisis data."
                },
                {
                    "user_id": "V4",
                    "content": "Machine Learning memungkinkan sistem untuk beradaptasi dengan perubahan dalam data dan lingkungan dengan lebih baik daripada pendekatan berbasis aturan."
                },
                {
                    "user_id": "V5",
                    "content": "Pengembangan sistem informasi yang inovatif harus mempertimbangkan penerapan Machine Learning untuk meningkatkan kecerdasan sistem."
                },
                {
                    "user_id": "V6",
                    "content": "Machine Learning dapat digunakan untuk analisis prediktif dalam berbagai industri, seperti perbankan, kesehatan, dan e-commerce."
                },
                {
                    "user_id": "V7",
                    "content": "Penting untuk memiliki data berkualitas untuk melatih algoritma Machine Learning dengan benar. Data yang buruk dapat menghasilkan hasil yang buruk."
                },
                {
                    "user_id": "V8",
                    "content": "Machine Learning adalah alat yang kuat, tetapi juga memerlukan pemahaman yang mendalam untuk menggunakannya secara efektif."
                },
                {
                    "user_id": "V9",
                    "content": "Machine Learning memungkinkan sistem untuk mengambil keputusan berdasarkan bukti dan data, bukan hanya intuisi manusia."
                },
                {
                    "user_id": "V10",
                    "content": "Pengembangan sistem informasi yang adaptif harus dapat memanfaatkan Machine Learning untuk menghadapi tantangan yang kompleks."
                }
            ]
        },
        {
            "content": "Apa yang dimaksud dengan Arsitektur Mikroservis dan bagaimana digunakan dalam pengembangan sistem informasi?",
            "answer_key": "Arsitektur Mikroservis adalah pendekatan dalam pengembangan perangkat lunak di mana aplikasi dibangun sebagai serangkaian layanan kecil yang independen. Ini digunakan dalam pengembangan sistem informasi untuk meningkatkan skalabilitas, fleksibilitas, dan pemeliharaan sistem.",
            "keyword": [
                "Arsitektur Mikroservis",
                "Pengembangan Sistem Informasi",
                "Skalabilitas"
            ],
            "responses": [
                {
                    "user_id": "W1",
                    "content": "Arsitektur Mikroservis adalah cara yang cerdas untuk membangun aplikasi yang mudah dikelola dan ditingkatkan."
                },
                {
                    "user_id": "W2",
                    "content": "Dalam pengembangan sistem informasi, Arsitektur Mikroservis memungkinkan pengembangan dan pemeliharaan yang lebih modular."
                },
                {
                    "user_id": "W3",
                    "content": "Arsitektur Mikroservis memecah aplikasi menjadi komponen yang lebih kecil, yang dapat dikembangkan oleh tim yang berbeda."
                },
                {
                    "user_id": "W4",
                    "content": "Skalabilitas adalah salah satu keunggulan utama dari Arsitektur Mikroservis. Layanan dapat diubah jumlahnya sesuai kebutuhan."
                },
                {
                    "user_id": "W5",
                    "content": "Pengembangan sistem informasi yang inovatif harus mempertimbangkan Arsitektur Mikroservis untuk meningkatkan fleksibilitas dan responsifnya."
                },
                {
                    "user_id": "W6",
                    "content": "Dalam Arsitektur Mikroservis, setiap layanan memiliki tugasnya sendiri, yang membuat pemeliharaan lebih mudah dan efisien."
                },
                {
                    "user_id": "W7",
                    "content": "Penting untuk memiliki manajemen yang baik dalam Arsitektur Mikroservis untuk menghindari kekacauan."
                },
                {
                    "user_id": "W8",
                    "content": "Pengembangan sistem informasi yang adaptif harus dapat memanfaatkan Arsitektur Mikroservis untuk merespons perubahan bisnis dengan cepat."
                },
                {
                    "user_id": "W9",
                    "content": "Arsitektur Mikroservis dapat membantu menghindari dampak buruk jika satu layanan mengalami masalah, karena layanan lainnya tetap berjalan."
                },
                {
                    "user_id": "W10",
                    "content": "Pengembangan dengan Arsitektur Mikroservis memerlukan pemahaman yang kuat tentang arsitektur dan manajemen yang baik."
                }
            ]
        },
        {
            "content": "Apa peran Penting DevOps dalam pengembangan sistem informasi?",
            "answer_key": "DevOps adalah praktik pengembangan perangkat lunak yang mengintegrasikan pengembangan (Dev) dan operasi (Ops) untuk meningkatkan siklus pengembangan dan pengiriman perangkat lunak. Perannya dalam pengembangan sistem informasi adalah mempercepat pengembangan, meningkatkan kualitas, dan mengurangi risiko.",
            "keyword": [
                "DevOps",
                "Pengembangan Sistem Informasi",
                "Pengiriman Perangkat Lunak"
            ],
            "responses": [
                {
                    "user_id": "X1",
                    "content": "DevOps adalah tentang menghilangkan hambatan antara pengembangan dan operasi. Ini memungkinkan perubahan cepat dan responsif terhadap kebutuhan bisnis."
                },
                {
                    "user_id": "X2",
                    "content": "Dalam pengembangan sistem informasi, DevOps dapat membantu mengurangi konflik antara tim pengembangan dan operasi, yang sering menghambat pengembangan."
                },
                {
                    "user_id": "X3",
                    "content": "DevOps adalah kunci untuk pengiriman perangkat lunak yang lebih cepat dan lebih andal. Ini membantu dalam memenuhi harapan pengguna yang semakin tinggi."
                },
                {
                    "user_id": "X4",
                    "content": "Pengembangan sistem informasi yang adaptif harus memanfaatkan praktik DevOps untuk merespons perubahan pasar dengan cepat."
                },
                {
                    "user_id": "X5",
                    "content": "DevOps memungkinkan otomatisasi pengujian dan pengiriman perangkat lunak, yang meningkatkan efisiensi dan kualitas pengembangan."
                },
                {
                    "user_id": "X6",
                    "content": "Penting untuk memiliki budaya kolaboratif dalam organisasi untuk menerapkan DevOps dengan sukses."
                },
                {
                    "user_id": "X7",
                    "content": "DevOps adalah tentang menghilangkan hambatan antara pengembangan dan operasi. Ini memungkinkan perubahan cepat dan responsif terhadap kebutuhan bisnis."
                },
                {
                    "user_id": "X8",
                    "content": "Pengembangan sistem informasi yang efektif harus memperhitungkan aspek DevOps untuk mengoptimalkan pengembangan dan pengiriman."
                },
                {
                    "user_id": "X9",
                    "content": "DevOps memungkinkan pemantauan yang lebih baik terhadap kinerja aplikasi dalam lingkungan produksi."
                },
                {
                    "user_id": "X10",
                    "content": "Pengembangan sistem informasi yang responsif harus memanfaatkan DevOps untuk mempercepat peluncuran fitur dan perbaikan."
                }
            ]
        }
    ]
}
        """)
