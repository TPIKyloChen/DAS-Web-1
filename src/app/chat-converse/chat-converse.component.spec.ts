import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConverseComponent } from './chat-converse.component';

describe('AgentConverseComponent', () => {
  let component: ChatConverseComponent;
  let fixture: ComponentFixture<ChatConverseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatConverseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
