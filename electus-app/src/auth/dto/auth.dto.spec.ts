import { validate } from 'class-validator';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

describe('Auth DTO Validation', () => {
  describe('LoginDto', () => {
    it('should validate valid login credentials', async () => {
      const dto = new LoginDto();
      dto.Email = 'user@example.com';
      dto.Password = 'secret123';
      dto.DeviceName = 'Laptop';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid email format', async () => {
      const dto = new LoginDto();
      dto.Email = 'not-an-email';
      dto.Password = 'secret123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('Email');
    });

    it('should reject missing password', async () => {
      const dto = new LoginDto();
      dto.Email = 'user@example.com';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'Password')).toBe(true);
    });
  });

  describe('RegisterDto', () => {
    it('should validate valid registration payload', async () => {
      const dto = new RegisterDto();
      dto.FullName = 'John Doe';
      dto.Email = 'john@example.com';
      dto.Password = 'securepass123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject password with less than 6 characters', async () => {
      const dto = new RegisterDto();
      dto.FullName = 'John Doe';
      dto.Email = 'john@example.com';
      dto.Password = '123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'Password')).toBe(true);
    });

    it('should reject missing FullName', async () => {
      const dto = new RegisterDto();
      dto.Email = 'john@example.com';
      dto.Password = 'securepass123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'FullName')).toBe(true);
    });
  });
});
