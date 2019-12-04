import {Component, Input, OnInit} from '@angular/core';
import {RecipeDTO} from "../../../DTOs/recipe-dto";
import {StepDTO, StepList} from "../../../DTOs/step-dto";
import {IngredientDTO, IngredientList} from "../../../DTOs/ingredient-dto";
import {IngredientService} from "../../../services/ingredient.service";
import {Subscription} from "rxjs";
import {RecipeService} from "../../../services/recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {StepService} from "../../../services/step.service";
import {ReviewDTO, ReviewList} from "../../../DTOs/review-dto";
import {ReviewService} from "../../../services/review.service";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  private idParam:string;
  private idRecipe:number;
  private _recipe: RecipeDTO;
  private _spices:number[];
  private _ingredients: IngredientList;
  private _steps: StepList;
  private _reviews: ReviewList;
  private subscriptions: Subscription[] = [];

  constructor(private ingredientService: IngredientService,
              private stepService: StepService,
              private recipeService: RecipeService,
              private reviewService: ReviewService,
              public route:ActivatedRoute,
              public router:Router) { }

  ngOnInit() {

    console.log(this.route.paramMap);
    const sub = this.route.paramMap.subscribe(params =>{
      this.idParam = params.get("id");
      console.log(this.idParam);
      this.idRecipe = parseInt(this.idParam);
    });

    console.log(this.idRecipe);
    this.subscriptions.push(sub);
    this.loadRecipe();
    this.loadIngredients();
    this.loadSteps();
    this.loadReviews();
  }

  get recipe(): RecipeDTO {
    return this._recipe;
  }

  set recipe(value: RecipeDTO) {
    this._recipe = value;
    this.updateSpice(value.spiceRate);
  }

  get spices(): number[] {
    return this._spices;
  }

  set spices(value: number[]) {
    this._spices = value;
  }

  get steps(): StepDTO[] {
    return this._steps;
  }

  set steps(value: StepDTO[]) {
    this._steps = value;
  }
  get ingredients(): IngredientDTO[] {
    return this._ingredients;
  }

  set ingredients(value: IngredientDTO[]) {
    this._ingredients = value;
  }

  get reviews(): ReviewDTO[] {
    return this._reviews;
  }

  set reviews(value: ReviewDTO[]) {
    this._reviews = value;
  }

  updateSpice(nb:number){
    this._spices = Array(nb).fill(0);
  }

  loadIngredients()
  {
    const sub:Subscription = this.ingredientService
        .queryRecipeId(this.idRecipe)
        .subscribe(ingredients => this.ingredients = ingredients);
    this.subscriptions.push(sub);
  }


  private loadRecipe() {
    const sub: Subscription = this.recipeService
        .queryId(this.idRecipe)
        .subscribe(recipes => this.recipe=recipes[0]);
    this.subscriptions.push(sub);
  }

  private loadSteps()
  {
    const sub: Subscription = this.stepService
        .queryByRecipe(this.idRecipe)
        .subscribe(steps => this.steps = steps);
    this.subscriptions.push(sub);
  }

  private loadReviews()
  {
    const sub: Subscription = this.reviewService
        .queryByRecipe(this.idRecipe)
        .subscribe(reviews => this.reviews = reviews);
    this.subscriptions.push(sub);
  }
}