

const WelcomeScreen = () => {

  return (
    <div className="justify-center bg-background flex-col gap-2 rounded-lg border p-8">
      <h1 className="text-xl font-semibold mb-4">Selamat Datang di DakoBot!</h1>
      <p className="text-muted-foreground leading-normal mb-2">Halo! Saya adalah asisten virtual dari Dako Brand and Communication. Senang bisa membantu Anda hari ini! Kami siap memberikan informasi yang Anda butuhkan untuk lebih memahami tentang perusahaan kami.</p>
      <p className="text-muted-foreground leading-normal">Jika Anda butuh bantuan, cukup ketik pesan Anda, dan saya akan siap membantu!</p>
    </div>
  );
};

export default WelcomeScreen;
