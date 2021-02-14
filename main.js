/// zmienne globalne ///
var position_0x = 50   // przesunięcie canvasu z grą w stosunku do rogu ekranu w osi x
var position_0y = 70   // przesunięcie canvasu z grą w stosunku do rogu ekranu w osi y (panel górny nie jest uwzględniany)
var enemy_number = 0   // przechowuje ostatnio nadany numer przeciwnika
var en_ammo = 0   // przechowuje ostatnio nadany numer pocisku przeciwnika
var fr_ammo = 0   // przechowuje ostatnio nadany numer pocisku gracza
var allowed_pause = false   // określa czy gra może zostać zapauzowana
var game_in_progress = false   // określa czy gra jest w trakcie czy jest zatrzymana (pauza, ekran startowy, koniec gry)
var ekran_game_over = false   // określa czy ekran końca gry jest wyświetlony
var pressed_key = false   // określa czy któryś z przycisków jest naciśnięty
var victory_check = false   // określa czy gra zakończyła się zwycięstwem czy porażką
var tab_pociski_gracz = []   // tabela z pociskami gracza (obiektami klasy Pocisk_gracza)
var tab_pociski_przeciwnik = []   // tabela z pociskami przeciwnika (obiektami klasy Pocisk_przeciwnika)
var tab_przeciwnicy = []   // tabela z przeciwnikami (obiektami klasy Przeciwnik)
var arrow = ''   // przechowuje nazwę ostatnio naciśniętego przycisku

/// tworzenie stałych canvasów ///
create_canvas('tlo', 1200, 800, 0, 0, 'visible', 0)   // czarne tło
draw_tlo(document.getElementById('tlo'))
create_canvas('top_tlo', 1200, 50, 0, -50, 'visible', 0)   // czarne tło na górnym pasku
draw_tlo(document.getElementById('top_tlo'))
create_canvas('continue_button', 400, 200, 400, 300, 'hidden')   // canvas z napisem CONTINUE
create_center_text('continue_button', 50, 'CONTINUE')
create_canvas('pauza', 400, 200, 400, 100, 'hidden')   // canvas z napisem PAUZA
create_center_text('pauza', 80, 'PAUZA')
create_canvas('start_button', 400, 200, 400, 100, 'visible')   // canvas z napisem START
create_center_text('start_button', 50, 'START')
create_canvas('top_stat', 1200, 50, 0, -50, 'hidden')   // górny pasek na którym póżniej będą zapisane informacje

/// funkcje onclick ///
// po nacisnięciu canvasu start_button uruchamia się gra
start_button.onclick = start_game

// po nacisnięciu canvasu tlo, jeżeli zakończyła się gra wyświetla się ekran startowy
tlo.onclick = ekran_start

// po naciśnięciu przycisku zapisuje który został naciśnięty i zaznacza że do tego doszło
document.onkeydown = function(e) {
    arrow = e.key
    pressed_key = true
}

// zaznacza, że przycisk nie jest już naciśnięty
document.onkeyup = function(e) {
    pressed_key = false
}

/// główny program ///
// wszystkie rzeczy sprawdzane z czestotliwoscia 60 fps w pętli
mainLoop = () => {
    if (game_in_progress) {
        dzialania_na_obiektach()
    }
    key_actions()
    requestAnimationFrame(this.mainLoop)
}

// wszystkie działania odbywające się w pętli na obiektach podczas gry
function dzialania_na_obiektach() {
    // gracz oddaje strzał
    ja.strzal()

    // działania na pociskach gracza
    for (i=0; i<tab_pociski_gracz.length; i++) {
        // ruch pocisku
        tab_pociski_gracz[i].leci()
        // jeżeli doleciał do końca ekranu to zostaje usunięty
        if (tab_pociski_gracz[i].posy < 0) {
            document.getElementById(tab_pociski_gracz[i].tag).remove()
            tab_pociski_gracz.splice(i,1)
        }
        // pocisk znajduje się na wysokości przeciwników
        if (tab_pociski_gracz[i].posy < 100) {
            // jeżeli pozycja pocisku pokrywa się z przeciwnikiem to umieszcza przeciwnika (lub przeciwników) w tabeli 
            var tab_potential_double = []
            for (e=0; e<tab_przeciwnicy.length; e++) {
                if (tab_przeciwnicy[e].posx < tab_pociski_gracz[i].posx + 2 && tab_przeciwnicy[e].posx + 74 > tab_pociski_gracz[i].posx + 2) {
                    tab_potential_double.push(tab_przeciwnicy[e])
                }
            }
            // jeżeli trafiono kilku przeciwników to podziel dmg pomiędzy nich
            if (tab_potential_double.length > 1) {
                var dmg = Math.round(tab_pociski_gracz[i].atk / tab_potential_double.length)
                for (d=0; d<tab_potential_double.length; d++) {
                    tab_potential_double[d].hit(dmg)
                }
                // usuń pociski
                document.getElementById(tab_pociski_gracz[i].tag).remove()
                tab_pociski_gracz.splice(i,1)
            }
            // jeżeli trafiono jednego przeciwnika to zadaj mu pełne obrażenia
            if (tab_potential_double.length == 1) {
                tab_potential_double[0].hit(tab_pociski_gracz[i].atk)
                // usuń pocisk
                document.getElementById(tab_pociski_gracz[i].tag).remove()
                tab_pociski_gracz.splice(i,1)
            }           
        }
    }

    // działania na przeciwnikach
    for (en=tab_przeciwnicy.length-1; en>=0; en--) {
        // uaktualnia tekst, wykonuje strzał i ruch
        tab_przeciwnicy[en].draw_text()
        tab_przeciwnicy[en].strzal()
        tab_przeciwnicy[en].ruch()
        // usuwa zniszczonego przeciwnika, dodaje punkty i uaktualnia górny pasek 
        if (tab_przeciwnicy[en].hp <= 0) {
            ja.cash += tab_przeciwnicy[en].value
            draw_top_stat()
            document.getElementById(tab_przeciwnicy[en].tag).remove()
            tab_przeciwnicy.splice(en,1)
        }
    }

    // sprawdź czy są jeszcze przeciwnicy
    if (tab_przeciwnicy.length == 0) {
        // jak nie to zaznacz zwycięstwo i zakończ grę
        victory_check = true
        game_over()
    }

    // działania na pociskach przeciwników
    for (i=0; i<tab_pociski_przeciwnik.length; i++) {
        // ruch pocisku
        tab_pociski_przeciwnik[i].leci()
        // jeżeli doleciał do końca ekranu to zostaje usunięty
        if (tab_pociski_przeciwnik[i].posy > 800) {
            document.getElementById(tab_pociski_przeciwnik[i].tag).remove()
            tab_pociski_przeciwnik.splice(i,1)
        }
        // sprawdza czy doszło do trafienia
        if (tab_pociski_przeciwnik[i].posy > 700 && ja.posx < tab_pociski_przeciwnik[i].posx + 2 && ja.posx + 74 > tab_pociski_przeciwnik[i].posx + 2) {
            // zadaje obrażenia i uaktualnia górny pasek
            ja.hit(tab_pociski_przeciwnik[i].atk)
            draw_top_stat()
            // usuwa pocisk
            document.getElementById(tab_pociski_przeciwnik[i].tag).remove()
            tab_pociski_przeciwnik.splice(i,1)
        }
    }

    // jeżeli gracz jest zniszczony to zakończ grę
    if (ja.hp <= 0) {
        game_over()
    }
}

// działania przy naciśnięciu klawisza
function key_actions() {
    // sprawdza czy jakikolwiek klawisz jest naciśnięty
    if (pressed_key) {
        // jeżeli trwa gra to przesuwa gracza w prawo
        if (arrow == 'ArrowRight' && game_in_progress) {
            // uniemożliwia "wyjechanie" poza ekran
            if (ja.posx < 1125) {
                // pozycja zmienia się o tyle ile wynosi wartość spd w obiekcie klasy Gracz
                ja.posx += ja.spd
                document.getElementById('gracz').setAttribute('style', 'position:absolute;left:'+ (position_0x + ja.posx) +'px;top:'+ (position_0y + ja.posy) +'px;z-index:5')
            }
        }
        // jeżeli trwa gra to przesuwa gracza w lewo  
        if (arrow == 'ArrowLeft' && game_in_progress) {
            // uniemożliwia "wyjechanie" poza ekran
            if(ja.posx > 0) {
                // pozycja zmienia się o tyle ile wynosi wartość spd w obiekcie klasy Gracz
                ja.posx -= ja.spd
                document.getElementById('gracz').setAttribute('style', 'position:absolute;left:'+ (position_0x + ja.posx) +'px;top:'+ (position_0y + ja.posy) +'px;z-index:5')
            }
        }
        // działania po naciśnięciu Escape
        if (arrow == 'Escape') {
            // jeżeli trwa gra i dozwolona jest pauza to wyświetla ekran pauzy
            if (game_in_progress && allowed_pause) {
                // uznanie klawisza za nienaciśnięty (na wypadek przytrzymania go)
                pressed_key = false
                ekran_pauza()
            }
            // jeżeli gra nie postępuje i pauza jest dozwolona, następuje wznowienie gry
            else if (game_in_progress == false && allowed_pause) {
                // uznanie klawisza za nienaciśnięty (na wypadek przytrzymania go)
                pressed_key = false
                continue_game()
            }
        }
    }
}

// uruchamia pętle
mainLoop()