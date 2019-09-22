# **CHICK LEDGER APP**

## Daily Tasks:
### Pick eggs
  + Eggs are picked as from 7.30 AM till evening
  + These eggs are grouped together according to the following criteria:
      * Normal(based on the normal size of eggs)
      * Small (These are eggs that are deemed smaller than other eggs)
      * Large (These are eggs that are larger than other eggs)
      * Broken (These are eggs that may have got broke during the picking process)

### Add on Chicken feeds
  + Feeds are addedd as by the preference of the worker
  + This may be done daily or may be done once in every two days
    * it must be noted that the latter includes the adding of more sacks on the due day if chosen

## Bi-Weekly:
- Eggs sold
  - Eggs are sold twice a week ie. Monday and Thursday
  - On special occurrences, they may be sold once a week 

## Weekly:
  - Feeds brought
    + These feeds are meant to cater for the whole week

## EXAMPLE LEDGER:
  | DATE: EGG PRODUCE | FEEDS ADDED | CHICKEN REPORT (Notes)|
  |_____|_____________|_____________|_______________________|
  |_____|_____________|_____________|_______________________|

# REQUIREMENTS AND SPECIFICATION

## Functional Requirements:
  This app is meant to ease the tracking of the daily activity in the chicken farm for the farmer
  This is to be accomplished by:
    - Keeping track of egg  produce per day
    - Keep track of number of feed sacks used up on a daily
    - Keep track  of the treand co-relation betweeen the number of feeds used up and the number of eggs produced
    - Keep a ledger of total Money in and out as a result of the chicken farm
    - Keep track of the well being of the animals and cost of mantaining it

## Elaboration 

- Keep track of eggs produced per day:
  - At the end of the day, the worker should input number of eggs per category i.e: (NORMAL/SMALL/LARGE/BROKEN) 
  - The eggs should be stored in a json file in the fomart "DD_MM_YY.json"

- Keed track of umber of feed sacks used up on a daily
  - Upon addition, the feeds should be noted in the application

- Keep track of the co\-relation between ` let NO_OF_FEEDS_CONSUMED` and `NO_OF_EGGS_PRODUCED`
  There should be the coresponding arithmetic that allows for the calculaton of the trend

- Keep accounts on `TOTAL_MONEY_IN` and `TOTAL_MONEY_OUT`
  This is an extension of the previous functional requirement

- Keep track of the overall well being of the animals
  This should be done in terms of commenting on the general:
  - look of the animals
  - Commenting on the medication \(if under any) and its effect on the animals
  - **Track should also be kept of money spent on the animals' medicine**


# DESIGN AND IMPLEMENTATION

The application uses React-Native Framework to make the mobile appllication

The application will have the following classes:
  - Period
  - Produce
  - Animals
  - Feeds

## Inventory
  This class is abstract and handles the Inventory Management of the classes

## Period
  This is meant to be the home page of the application.
  This Page will have the option of being grouped by: 
   - Week \(ADVISED)
   - Year

  This periods will be arranged in cards that will give a rough overview of the week
  onClick: the cards will allow for the navigation into the specified weeek to detail clearly the occurrences

## Produce
  Shows the inventory in stock,
  This auto updates on the successful selling of each batch be it weekly or monthly,
  It also implicitly affects `class Period` upon successful selling off of a batch of eggs

## Animals
  Acts as an inventory manager for the Animals batch enrolled by the owner
  keeps track of the animals in terms of health and needs and casualties \(with the cause off casualty)

## Feeds
  Acts as an inventory manager for the feeds stock and updates all instances of Feeds for a batch of animals throughout the app


## Relation of classes
  Inventory
    ^
    |
    |
    |---------Animals--------------------------------Period
    |                                   |
    |                                   |
    |---------Produce--------------------
    |                                   |
    |                                   |
    |---------Feeds----------------------


# Overview

The data will be retrieved from a folder in INTERNAL_STORAGE where the data will be stored

example structure:
  \>__Data__
    \>__WN\_YN__ \(the data fomart is: __classLabel_date_month_year.json__)
      - __CHK\_DD\_MM\_YY.json__ 
      - __PRDC\_DD\_MM\_YY.json__
      - __FDS\_DD\_MM\_YY.json__

  Key:
    - CHK \-\> Chicken
    - PRDC \-\> Produce
    - FDS \-\> Feeds

This Structure tries to ensure the arrangement of data in a manageable way to ensure easy fetching without linear searching

The data will be stored in arrays that will allow for Matrix operations on the arrays to simplify logic for arithmetic

example json file:
  1. file_name = __"PRDC_05_07_18.json"__
    ```
    {
      "produce": {
        "normal": 900,
        "large": 30,
        "small": 120,
        "broken": 30,
      },
    }
    ```

    during calculation, the data from each json file is loaded into a 7 x 4 matrix e.g:
      ```
      // manually hardcoded for explanatory reasons, this might not bethe real implementation in the application's code
      let load = [
        [900, 30, 120, 30],
        [900, 30, 120, 30],
        [900, 30, 120, 30],
        [900, 30, 120, 30],
        [900, 30, 120, 30],
        [900, 30, 120, 30],
        [900, 30, 120, 30],
      ];
      ```
    This will allow for easy manipulation of the data in the use of a matrix librrary to manipulate it instead of hardcoding calculation methods into the code for each specific class

  2. __CHK\_DD\_MM\_YY.json__
    ```
    {
      "number": 1500,
      "casualties": [
        {
          "date": "dd/mm/yy",
          "numberDead": 2,
          "reasons": [
            "Canibalised",
            "",
          ]
        }
      ]
    }
    ```
  
  3. __FDS\_05\_07\_18.json__
    ```
    {
      "sacksInStock": 30,
      "sacksAdded": []
    }
    ```