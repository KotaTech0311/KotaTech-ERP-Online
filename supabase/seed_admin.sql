insert into companies (id, name, trade_name)
values ('00000000-0000-0000-0000-000000000001', 'KotaTech', 'KotaTech ERP')
on conflict (id) do nothing;

insert into app_users (
  company_id,
  full_name,
  username,
  password_hash,
  role,
  active
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin',
  'admin123',
  'Administrador',
  true
)
on conflict (username) do update
set password_hash = 'admin123',
    active = true,
    role = 'Administrador',
    full_name = 'Administrador';
