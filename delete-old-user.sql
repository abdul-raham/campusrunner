-- Delete the old faulty user and profile
DELETE FROM auth.users WHERE id = '42e7ba05-eca7-404c-8384-b5a5b8ddfc9c';
DELETE FROM profiles WHERE id = '42e7ba05-eca7-404c-8384-b5a5b8ddfc9c';