var score = 0;
var scoreText;

function create() {
    // Skor göstergesini ekleyelim
    scoreText = this.add.text(16, 16, 'Skor: 0', { fontSize: '32px', fill: '#fff' });

    // Skor kazandıracak eylemler ekleyin
    // Örneğin: Bir düşmanı yenmek
    this.physics.add.overlap(player, enemy, destroyEnemy, null, this);
}

function destroyEnemy(player, enemy) {
    enemy.destroy();
    score += 10; // Skor artışı
    scoreText.setText('Skor: ' + score); // Skoru güncelle
}
function create() {
    // Düşmanı ekleyelim
    enemy = this.physics.add.sprite(700, 300, 'enemy');
    enemy.setVelocityX(-100); // Düşman sola doğru hareket eder
}

function update() {
    // Düşman ekrandan çıktıysa yeniden ekrana sokalım
    if (enemy.x < 0) {
        enemy.setX(800); // Düşman sağdan tekrar başlar
    }
}
