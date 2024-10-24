// Phaser oyun ayarları
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }, // Zıplama için yerçekimi
            debug: false // Fizik hatalarını görmek için debug açabilirsiniz
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// Oyun içi değişkenler
var player;
var cursors;
var traps;
var bombs;
var score = 0;
var scoreText;
var timerText;
var gameTime = 30; // Oyun süresi 30 saniye
var gameOver = false;

// Grafik dosyalarını yüklüyoruz
function preload() {
    this.load.image('background', 'https://3xent123.github.io/Html5game/Background.png'); // Arka plan
    this.load.image('player', 'https://3xent123.github.io/Html5game/Samurai.png'); // Oyuncu karakteri
    this.load.image('trap', 'https://3xent123.github.io/Html5game/Trap.png'); // Tuzak
    this.load.image('bomb', 'https://3xent123.github.io/Html5game/Bomb.png'); // Bomba
}

// Oyunu kuruyoruz
function create() {
    // Arka planı sahneye ekleyelim ve uygun şekilde ölçekleyelim
    let background = this.add.image(400, 300, 'background');
    background.setDisplaySize(800, 600); // Arka planı oyun boyutlarına göre ölçekleyelim

    // Tuzakları ve bombaları ekleyelim
    traps = this.physics.add.group();
    bombs = this.physics.add.group();

    // Tuzakların rastgele düşmesi için zamanlayıcı ayarları
    this.time.addEvent({
        delay: 250, // Her 0.25 saniyede bir yeni tuzak düşecek
        callback: dropTrap,
        callbackScope: this,
        loop: true
    });

    // Bombaların rastgele düşmesi için zamanlayıcı ayarları
    this.time.addEvent({
        delay: 1500, // Her 2 saniyede bir bomba düşecek
        callback: dropBomb,
        callbackScope: this,
        loop: true
    });

    // Oyuncu karakterini ekliyoruz
    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.02); // Karakterin boyutunu %0.02 oranında küçültüyoruz
    player.setBounce(0.2); // Zıpladıktan sonra sekme
    player.setCollideWorldBounds(true); // Ekran dışına çıkmasını engelle

    // Puan metni (kalınlaştırıldı, renk siyah, font boyutu %10 küçültüldü)
    scoreText = this.add.text(16, 16, 'Skor: 0', { fontSize: '28px', fill: '#000', fontStyle: 'bold' });

    // Zamanlayıcı metni (kalınlaştırıldı, renk siyah, font boyutu %10 küçültüldü)
    timerText = this.add.text(650, 16, 'Süre: 30', { fontSize: '28px', fill: '#000', fontStyle: 'bold' });

    // 30 saniye süresi için zamanlayıcı
    this.time.addEvent({
        delay: 1000, // Her saniye bir kez çağrılacak
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });
}

// Oyun döngüsü
function update() {
    if (gameOver) {
        return; // Eğer oyun bittiyse hiçbir şey yapılmasın
    }

    // Mouse hareketine göre oyuncu karakterini x ekseninde hareket ettiriyoruz
    if (this.input.activePointer.isDown) {
        // Mouse'un x pozisyonunu alıyoruz ve karakterin x pozisyonunu mouse'un x pozisyonuna ayarlıyoruz
        player.x = this.input.activePointer.x;
    }

    // Tuzaklarla ve bombalarla çarpışma kontrolü
    this.physics.add.overlap(player, traps, hitTrap, null, this);
    this.physics.add.overlap(player, bombs, hitBomb, null, this);
}

// Tuzaklarla çarpışma fonksiyonu
function hitTrap(player, trap) {
    trap.disableBody(true, true); // Tuzak yok edilir
    score += 10; // Puan artırılır
    scoreText.setText('Skor: ' + score); // Skor güncellenir
}

// Bombalarla çarpışma fonksiyonu
function hitBomb(player, bomb) {
    bomb.disableBody(true, true); // Bomba yok edilir
    score -= 20; // Puan azaltılır
    if (score < 0) score = 0; // Puan negatif olmasın
    scoreText.setText('Skor: ' + score); // Skor güncellenir
}

// Zamanlayıcıyı güncelleyen fonksiyon
function updateTimer() {
    gameTime--; // Her saniyede bir süre azalır
    timerText.setText('Süre: ' + gameTime);

    if (gameTime <= 0) {
        gameTime = 0; // Süre 0'da duracak
        gameOver = true; // Oyun bitti
        timerText.setText('Süre: 0'); // Süre sıfır olduğunda gösterilecek
        // Tebrikler mesajı
        this.add.text(400, 300, 'TEBRİKLER! Puanınız: ' + score, { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
    }
}

// Tuzakları rastgele düşüren fonksiyon
function dropTrap() {
    if (gameOver) return;

    let x = Phaser.Math.Between(0, 800); // Rastgele bir X pozisyonu seçiliyor
    let trap = traps.create(x, 0, 'trap'); // Tuzak oluşturuluyor
    let randomScale = Phaser.Math.FloatBetween(0.08, 0.2); // Tuzak boyutu rastgele belirleniyor
    trap.setScale(randomScale); // Rastgele boyut uygulanıyor
    trap.setVelocityY(Phaser.Math.FloatBetween(50, 100)); // Aşağıya yavaş düşme hızı ayarlandı
    trap.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // Zıplama
}

// Bombaları rastgele düşüren fonksiyon
function dropBomb() {
    if (gameOver) return;

    let x = Phaser.Math.Between(0, 800); // Rastgele bir X pozisyonu seçiliyor
    let bomb = bombs.create(x, 0, 'bomb'); // Bomba oluşturuluyor
    bomb.setScale(0.2); // Bomba boyutu
    bomb.setVelocityY(Phaser.Math.FloatBetween(50, 100)); // Aşağıya yavaş düşme hızı ayarlandı
}
