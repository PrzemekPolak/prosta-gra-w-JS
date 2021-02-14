class Gracz {
    constructor(tag) {
        this.tag = tag;
        this.hp = 100;
        this.maxhp = 100
        this.atk = 20;
        this.def = 10;
        this.spd = 5;
        this.posx = 400;
        this.posy = 700;
        this.rof = 60;
        this.cash = 0
    }
    // ładuje obraz
    draw() {
        var pctx = document.getElementById(this.tag).getContext('2d');
        var img2 = new Image();
        img2.onload = function () {
            pctx.drawImage(img2, 0, 0, 75, 75);
        };
        img2.src = './grafika/gracz.jpg';
    }
    // wykonuje strzał
    strzal() {
        // przy każdym wywołaniu zmniejsza wartość rof o 1
        this.rof -= 1;
        // po osiągnięciu 0 tworzy obiekt klasy Pocisk_gracza i odpowiadający mu canvas
        if (this.rof == 0) {
            fr_ammo += 1;
            var pocisk_fr = new Pocisk_gracza(this.posx, this.atk, 'fr' + fr_ammo);
            tab_pociski_gracz.push(pocisk_fr);
            // resetuje wartość rof
            this.rof = 60;
            create_canvas('fr' + fr_ammo, 7, 12, this.posx + 35, this.posy, 'visible', 2)
            pocisk_fr.draw();
        }
    }
    // obiekt został trafiony
    hit(atk) {
        // odejmuje tyle hp ile wynosi wartość atk pocisku przeciwnika
        this.hp -= atk;
    }
}


class Pocisk_gracza {
    constructor(posx, atk, tag) {
        this.tag = tag;
        this.posx = posx + 35;
        this.posy = 700;
        this.atk = atk;
        this.vis = 'visible'
    }
    // ładuje obraz
    draw() {
        var pctx = document.getElementById(this.tag).getContext('2d');
        var img = new Image();
        img.onload = function () {
            pctx.drawImage(img, 0, 0, 7, 12);
        };
        img.src = './grafika/pocisk_gracza.jpg';
    }
    // wykonuje ruch
    leci() {
        // zmienia pozycję y i przesuwa canvas
        this.posy -= 10;
        this.update_style()   
    }
    // uaktualnia styl aby wprowadzić ewentualne zmiany
    update_style() {
        document.getElementById(this.tag).setAttribute('style', 'position:absolute;left:' + (position_0x + this.posx) + 'px;top:' + (position_0y +
        this.posy) + 'px;z-index:2;visibility:' + this.vis);
    }
}


class Przeciwnik {
    constructor(posx, tag) {
        this.tag = tag;
        this.hp = 50;
        this.atk = 10;
        this.def = 10;
        this.spd = 10;
        this.posx = posx;
        this.posy = 25;
        this.rof = 60;
        this.value = 30
        this.kierunek = 'prawo';
        this.vis = 'visible'
    }
    // ładuje obraz
    draw() {
        var pctx = document.getElementById(this.tag).getContext('2d');
        var img = new Image();
        img.onload = function () {
            pctx.drawImage(img, 0, 0, 75, 75);
        };
        img.src = './grafika/przeciwnik.jpg';
    }
    // tworzy na canvasie tekst
    draw_text() {
        var pctx = document.getElementById(this.tag).getContext('2d');
        pctx.font = "18px Arial";
        pctx.fillStyle = "red";
        pctx.fillText('HP:' + this.hp, 5, 20);
        pctx.fillText('ATK:' + this.atk, 5, 40);
        pctx.fillText('DEF:' + this.def, 5, 60);
    }
    // wykonuje strzał
    strzal() {
        // przy każdym wywołaniu zmniejsza wartość rof o 1
        this.rof -= 1;
        // po osiągnięciu 0 tworzy obiekt klasy Pocisk_przeciwnika i odpowiadający mu canvas
        if (this.rof == 0) {
            en_ammo += 1;
            var pocisk_en = new Pocisk_przeciwnika(this.posx, this.atk, en_ammo);
            tab_pociski_przeciwnik.push(pocisk_en);
            // resetuje wartość rof
            this.rof = 60;
            create_canvas(en_ammo, 7, 12, this.posx + 35, this.posy, 'visible', 2) ;           
            pocisk_en.draw();
        }
    }
    // wykonuje ruch
    ruch() {
        var zmiana = Math.random();
        // jeżeli wylosowana wartość jest mniejsza niż 0.02, albo obiekt jest na krawędzi ekranu, następuje zmiana kierunku ruchu
        if (zmiana < 0.02 || this.posx < 4 || this.posx > 1122) {
            if (this.kierunek == 'prawo') {
                this.kierunek = 'lewo';
            }
            else {
                this.kierunek = 'prawo';
            }
        }
        // wykonuje ruch w prawo
        if (this.kierunek == 'prawo') {
            this.posx += 4;
            this.update_style()
        }
        // wykonuje ruch w lewo
        else {
            this.posx -= 4;
            this.update_style()
        }
    }
    // obiekt został trafiony
    hit(atk) {
        // odejmuje tyle hp ile wynosi wartość atk pocisku gracza
        this.hp -= atk;
        this.draw();
    }
    // uaktualnia styl aby wprowadzić ewentualne zmiany
    update_style() {
        document.getElementById(this.tag).setAttribute('style', 'position:absolute;left:' + (position_0x + this.posx) + 'px;top:' + (position_0y +
        this.posy) + 'px;z-index:3;visibility:' + this.vis)
    }
}


class Pocisk_przeciwnika {
    constructor(posx, atk, tag) {
        this.tag = tag;
        this.posx = posx + 35;
        this.posy = 25;
        this.atk = atk;
        this.vis = 'visible'
    }
    // ładuje obraz
    draw() {
        var pctx = document.getElementById(this.tag).getContext('2d');
        var img = new Image();
        img.onload = function () {
            pctx.drawImage(img, 0, 0, 7, 12);
        };
        img.src = './grafika/pocisk_przeciwnika.jpg';
    }
    // wykonuje ruch
    leci() {
        // zmienia pozycję y i przesuwa canvas
        this.posy += 10;
        this.update_style()
    }
    // uaktualnia styl aby wprowadzić ewentualne zmiany
    update_style() {
        document.getElementById(this.tag).setAttribute('style', 'position:absolute;left:' + (position_0x + this.posx) + 'px;top:' + (position_0y +
        this.posy) + 'px;z-index:2;visibility:' + this.vis);
    }
}