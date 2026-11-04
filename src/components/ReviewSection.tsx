import React, { useState } from 'react';

export const ReviewSection: React.FC = () => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Mohon tuliskan sepatah kata ulasan Anda.');
      return;
    }

    setSubmittedMessage(
      `Terima kasih! Penilaian bintang ${rating} Anda berhasil dikirim dan ditambahkan ke profil mitra.`
    );
    setComment('');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-forest bg-forest-50 px-3 py-1 rounded-full">
          Ulasan Konsumen
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">Beri Penilaian Pengalaman Anda</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Penilaian Anda membantu peternak terus menjaga kebersihan kandang dan mutu susu.
        </p>

        {submittedMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-forest text-xs font-bold border border-emerald-200 animate-fadeIn">
            ✓ {submittedMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-cream p-6 rounded-3xl border border-slate-200 space-y-4 text-xs shadow-sm">
          {/* 5 Bintang Interaktif */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(star)}
                className="text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
              >
                <i
                  className={`ti ${
                    (hoverRating !== null ? hoverRating >= star : rating >= star)
                      ? 'ti-star-filled text-amber-400'
                      : 'ti-star text-slate-300'
                  }`}
                ></i>
              </button>
            ))}
          </div>

          <p className="font-bold text-slate-700">Rating: {rating} dari 5 Bintang</p>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan rasa susu, dinginnya kemasan, atau ketepatan waktu kurir..."
            className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-forest outline-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow cursor-pointer transition-colors"
          >
            Kirim Penilaian
          </button>
        </form>
      </div>
    </section>
  );
};
