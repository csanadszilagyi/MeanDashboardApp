import {
    trigger,
    animate,
    transition,
    style,
    query,
    state,
    group
} from '@angular/animations';

export const scaleAnimation = trigger('scaleAnimation', [
    state('false', style({
      transform: 'scale(1)'
    })),
    state('true', style({
      transform: 'scale(1.2)'
    })),
    transition('false => true', animate('200ms ease-in')),
    transition('true => false', animate('200ms ease-out'))
]);

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
        // order
        // 1
        query(':enter, :leave', style({ position: 'absolute', width: '100%', top: 0, left: 0 })
          , { optional: true }),
        // 2
        group([  // block executes in parallel
              query(':enter', [
              style({ opacity: 0 }),
              animate('0.5s ease-in-out', style({ opacity: 1 }))
              ], { optional: true }),
              query(':leave', [
              style({ opacity: 1 }),
              animate('0.25s ease-in-out', style({ opacity: 0 }))
              ], { optional: true })
          ])
      ])
/*
    transition('* <=> *', [
      // order
      // 1
      query(':enter, :leave', style({ position: 'absolute', width: '100%', top: 0, left: 0 })
        , { optional: true }),
      // 2
      group([  // block executes in parallel
            query(':enter', [
            style({ opacity: 0, transform: 'translateX(50%)' }),
            animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
            style({ opacity: 1, transform: 'translateX(0%)' }),
            animate('0.25s ease-in-out', style({ opacity: 0, transform: 'translateX(-50%)' }))
            ], { optional: true })
        ])
    ])*/
]);

