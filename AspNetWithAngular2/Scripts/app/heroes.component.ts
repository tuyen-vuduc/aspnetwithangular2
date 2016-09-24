﻿import {Component, OnInit} from '@angular/core'

import {Router} from '@angular/router'

import {Hero} from './hero'

import {HeroService} from './hero.service'

@Component({
    selector: 'heroes',
    template: `
<h2>My Heroes</h2>
<div>
  <label>Hero name:</label> <input #heroName />
  <button (click)="add(heroName.value); heroName.value=''">
    Add
  </button>
</div>
<ul class="heroes">
    <li *ngFor="let hero of heroes" 
        (click)="selectHero(hero)"
        [class.selected]="hero == selectedHero"
        >
        <span class="badge">{{hero.id}}</span> 
        <span>{{hero.name}}</span>
        <button class="delete"
          (click)="delete(hero); $event.stopPropagation()">x</button>
    </li>
</ul>

<div *ngIf="selectedHero">
    <h2>
        {{selectedHero.name | uppercase}} is my hero
      </h2>
      <button (click)="gotoDetail()">View Details</button>
</div>
`,
    styles: [`
button.delete {
  float:right;
  margin-top: 2px;
  margin-right: .8em;
  background-color: gray !important;
  color:white;
}
  .selected {
    background-color: #CFD8DC !important;
    color: white;
  }
  .heroes {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;
  }
  .heroes li {
    cursor: pointer;
    position: relative;
    left: 0;
    background-color: #EEE;
    margin: .5em;
    padding: .3em 0;
    height: 1.6em;
    border-radius: 4px;
  }
  .heroes li.selected:hover {
    background-color: #BBD8DC !important;
    color: white;
  }
  .heroes li:hover {
    color: #607D8B;
    background-color: #DDD;
    left: .1em;
  }
  .heroes .text {
    position: relative;
    top: -3px;
  }
  .heroes .badge {
    display: inline-block;
    font-size: small;
    color: white;
    padding: 0.8em 0.7em 0 0.7em;
    background-color: #607D8B;
    line-height: 1em;
    position: relative;
    left: -1px;
    top: -4px;
    height: 1.8em;
    margin-right: .8em;
    border-radius: 4px 0 0 4px;
  }
`]
})
export class HeroesComponent implements OnInit {
    heroes: Hero[]
    selectedHero: Hero

    constructor(
        private heroService: HeroService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

    selectHero(hero: Hero) {
        this.selectedHero = hero
    }

    add(heroName: string) {
        heroName = heroName.trim()

        if (!heroName) {
            return;
        }

        this.heroService.createHero(heroName)
            .then(hero => {
                this.heroes.push(hero)
                this.selectedHero = null;
            });
    }

    delete(hero: Hero) {
        this.heroService.deleteHero(hero.id)
            .then(() => {
                this.heroes = this.heroes.filter(h => hero.id != h.id);

                if (this.selectedHero == hero) {
                    this.selectedHero = null;
                }
            });
    }

    gotoDetail() {
        let link = ['/detail', this.selectedHero.id]

        this.router.navigate(link)
    }
}