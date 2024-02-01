-- Create ORGANISER TABLE
CREATE table organiser (
    organiser_id INT unsigned auto_increment primary key,
    name VARCHAR(100) NOT NULL,
    contact_number INT unsigned NOT NULL,
    email VARCHAR(320) NOT NULL
) engine = innodb;

-- Create PARTICIPANT TABLE
CREATE table participant (
    participant_id INT unsigned auto_increment primary key,
    name VARCHAR(100) NOT NULL,
    contact_number INT unsigned NOT NULL,
    email VARCHAR(320) NOT NULL
) engine = innodb;

-- Create EVENT TABLE (PLEASE ADD BACK)
CREATE table event (
    event_id INT unsigned auto_increment primary key,
    title VARCHAR(150) NOT NULL,
    date_time DATETIME NOT NULL,
    location VARCHAR(100) NOT NULL
) engine = innodb;
-- ADDING ORGANISER FK TO EVENT
alter table event add column organiser_id int unsigned;
alter table event add constraint fk_event_organiser 
    foreign key (organiser_id) references organiser(organiser_id);

-- ADDING participant FK to EVENT
alter table event add column participant_id int unsigned;
alter table event add constraint fk_event_participant
    foreign key (participant_id) references participant(participant_id);



-- alter table event drop column payment_id

-- Create REGISTRATION TABLE
CREATE table registration (
    registration_id INT unsigned auto_increment primary key,
    registration_date DATETIME NOT NULL
) engine = innodb;


-- ADDING participant FK to REGISTRATION
alter table registration add column participant_id int unsigned;
alter table registration add constraint fk_participant_registration
    foreign key (participant_id) references participant(participant_id);

  -- ADDING event FK to REGISTRATION
alter table registration add column event_id int unsigned;
alter table registration add constraint fk_event_registration
    foreign key (event_id) references event(event_id);

      

-- Create PAYMENT TABLE
CREATE TABLE payment (
    payment_id INT UNSIGNED auto_increment primary key,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount INT UNSIGNED NOT NULL
) engine = innodb;



-- ADDING event FK to PAYMENT
alter table payment add column event_id int unsigned;
alter table payment add constraint fk_event_payment
    foreign key (event_id) references event(event_id);


-- ADDING participant FK to PAYMENT
alter table payment add column participant_id int unsigned;
alter table payment add constraint fk_participant_payment
    foreign key (participant_id) references participant(participant_id);

