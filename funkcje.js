// tworzy canvas o podanych atrybutach
function create_canvas(id, width, height, posx=0, posy=0, vis='visible', z_ind = 5) {
    var new_canvas = document.createElement('canvas')
    new_canvas.setAttribute('id', id)
    new_canvas.setAttribute('width', width)
    new_canvas.setAttribute('height', height)
    new_canvas.setAttribute('style', 'position:absolute;left:'+ (position_0x + posx) +'px;top:'+ (position_0y + posy) +'px;z-index:'+z_ind+';visibility:' + vis)
    document.body.appendChild(new_canvas)
}

// tworzy wyśrodkowany tekst o podanym rozmiarze na wybranym canvasie
function create_center_text(id, rozmiar, tekst) {
    var canv = document.getElementById(id)
    canvx = canv.getContext('2d')
    canvx.font = rozmiar + "px Arial"
    canvx.textAlign = 'center'
    canvx.fillStyle = "white"
    canvx.fillText(tekst, canv.width/2, canv.height/2)
}

// tworzy domyślnie czarne tło (zamalowuje canvas)
function draw_tlo(canv, color="black") {
    var tlox = canv.getContext('2d')
    tlox.fillStyle = color
    tlox.fillRect(0, 0, canv.width, canv.height)
}

// tworzy panel górny
function draw_top_stat() {
    // tworzy czarne tło
    draw_tlo(document.getElementById('top_stat'))
    // tworzy napisy
    var topx = document.getElementById('top_stat').getContext('2d')
    topx.font = "30px Arial"
    topx.fillStyle = "white"
    topx.fillText('HP: ' + ja.hp + '/' + ja.maxhp + '   ATK: ' + ja.atk + '   DEF: ' + ja.def + '   SPD: ' + ja.spd, 25, 40)
    topx.fillText('POINTS: ' + ja.cash, 950, 40)
    // rysuje linię oddzielającą panel górny od głównego
    topx.beginPath()
    topx.strokeStyle = 'white'
    topx.lineWidth = 5
    topx.moveTo(0, 50)
    topx.lineTo(1200, 50)
    topx.stroke()
}

// ukrywa podany canvas
function hide_canvas(canv) {
    document.getElementById(canv).style.visibility = "hidden"
}

// pokazuje podany canvas 
function show_canvas(canv) {
    document.getElementById(canv).style.visibility = "visible"
}

// ukrywa wszystkie canvasy w podanej tabeli
function hide_arr_of_canvas(arr) {
    for (i=0; i<arr.length; i++) {
        arr[i].vis = "hidden"
        arr[i].update_style()
    }
}

// pokazuje wszystkie canvasy w podanej tabeli
function show_arr_of_canvas(arr) {
    for (i=0; i<arr.length; i++) {
        arr[i].vis = "visible"
        arr[i].update_style()
    }
}

// usuwa wszystkie canvasy z podanej tabeli
function delete_arr_of_canvas(arr) {
    for (i=0; i<arr.length; i++) {
        document.getElementById(arr[i].tag).remove()
    }
}

// tworzy canvas oraz obiekt klasy Gracz
function create_player() {
    create_canvas('gracz', 75, 75, 400, 700, 'visible')
    ja = new Gracz('gracz')
    ja.draw()
}

// tworzy podaną liczbę przeciwników znajdujących się w losowym położeniu (pozycji x) i umieszcza ich we wspólnej tabeli
function create_enemy(number) {
    for (i=0; i<number; i++) {
        // tworzy unikatowy numer przeciwnika
        enemy_number += 1
        // losuje pozycje x
        var posx = Math.floor(Math.random() * (1120 - 5)) + 5
        // tworzy canvas i obiekt klasy Przeciwnik
        create_canvas('en' + enemy_number, 75, 75, posx, 0, 'visible')
        var en = new Przeciwnik(posx, 'en' + enemy_number)
        // umieszcza obiekt w tabeli
        tab_przeciwnicy.push(en)
        // rysuje obraz przeciwnika na canvasie
        en.draw()
    }    
}

// rozpoczyna grę; chowa przycisk startowy, tworzy gracza i przeciwników oraz wyświetla pasek górny
function start_game() {
    hide_canvas('start_button')
    create_player()
    create_enemy(6)
    draw_top_stat()
    show_canvas('top_stat')
    game_in_progress = true
    allowed_pause = true
}

// wyświetla ekran pauzy
function ekran_pauza() {
    // zatrzymuje grę
    game_in_progress = false
    // ukrywa powiązane z grą canvasy
    hide_canvas('top_stat')
    hide_arr_of_canvas(tab_pociski_gracz)
    hide_arr_of_canvas(tab_pociski_przeciwnik)
    hide_arr_of_canvas(tab_przeciwnicy)
    hide_canvas(ja.tag)
    // wyświetla canvasy związane z pauzą
    show_canvas('continue_button')
    show_canvas('pauza')
    // po naciśnięciu tego canvasu zostanie wznowiona gra
    continue_button.onclick = continue_game
}

// wznawia grę po pauzie
function continue_game() {
    // wyświetla powiązane z grą canvasy
    show_canvas('top_stat')
    show_canvas(ja.tag)
    show_arr_of_canvas(tab_pociski_gracz)
    show_arr_of_canvas(tab_pociski_przeciwnik)
    show_arr_of_canvas(tab_przeciwnicy)
    // ukrywa canvasy związane z pauzą
    hide_canvas('continue_button')
    hide_canvas('pauza')
    // wznawia grę
    game_in_progress = true
}

// Kończy grę po porażcę
function game_over() {
    // informuje że wyświetlany jest widok końca gry
    ekran_game_over = true
    // zatrzymuje grę (bo dalsze jej wykonywanie nie ma sensu)
    game_in_progress = false
    // blokuje możliwość pauzowania
    allowed_pause = false
    // ukrywa górny pasek oraz usuwa powiązane z grą canvasy
    hide_canvas('top_stat')
    delete_arr_of_canvas(tab_pociski_gracz)
    delete_arr_of_canvas(tab_pociski_przeciwnik)
    delete_arr_of_canvas(tab_przeciwnicy)
    // usuwa powiązane z grą obiekty
    document.getElementById('gracz').remove()
    tab_pociski_gracz = []
    tab_pociski_przeciwnik = []
    tab_przeciwnicy = []
    // sprawdza czy gra zakończyła się zwycięstwem czy porażką
    if (victory_check) {
        victory_check = false
        // tworzy napis
        create_center_text('tlo', 80, 'VICTORY')
    }
    else {
        // tworzy napis
        create_center_text('tlo', 80, 'GAME OVER')
    }
}

// jeżeli zakończyła się gra, wyświetlony zostaje ekran startowy
function ekran_start() {
    // sprawdza czy ekran końca gry jest wyświetlony
    if (ekran_game_over == true) {
        // zaznacza, że ekran końca gry nie jest już wyświetlany
        ekran_game_over = false
        // wyświetla przycisk startowy
        show_canvas('start_button')
        // zamalowuje napis
        draw_tlo(document.getElementById('tlo'))       
    }
}