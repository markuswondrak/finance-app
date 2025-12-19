package storage

import (
	"errors"
	"wondee/finance-app-backend/internal/models"
)

// MockRepository implements Repository for testing
type MockRepository struct {
	FixedCosts   []models.FixedCost
	SpecialCosts []models.SpecialCost
	Users        []models.User
}

func (m *MockRepository) LoadFixedCosts(userID uint) *[]models.FixedCost {
	var filtered []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.UserID == userID {
			filtered = append(filtered, c)
		}
	}
	return &filtered
}

func (m *MockRepository) SaveFixedObject(cost *models.FixedCost) {
	found := false
	for i, c := range m.FixedCosts {
		if c.ID == cost.ID && cost.ID != 0 {
			m.FixedCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		if cost.ID == 0 {
			cost.ID = len(m.FixedCosts) + 1
		}
		m.FixedCosts = append(m.FixedCosts, *cost)
	}
}

func (m *MockRepository) DeleteFixedCost(id int, userID uint) {
	var newCosts []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.ID != id || c.UserID != userID {
			newCosts = append(newCosts, c)
		}
	}
	m.FixedCosts = newCosts
}

func (m *MockRepository) LoadSpecialCosts(userID uint) *[]models.SpecialCost {
	var filtered []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.UserID == userID {
			filtered = append(filtered, c)
		}
	}
	return &filtered
}

func (m *MockRepository) SaveSpecialCost(cost *models.SpecialCost) {
	found := false
	for i, c := range m.SpecialCosts {
		if c.ID == cost.ID && cost.ID != 0 {
			m.SpecialCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		if cost.ID == 0 {
			cost.ID = len(m.SpecialCosts) + 1
		}
		m.SpecialCosts = append(m.SpecialCosts, *cost)
	}
}

func (m *MockRepository) DeleteSpecialCost(id int, userID uint) {
	var newCosts []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.ID != id || c.UserID != userID {
			newCosts = append(newCosts, c)
		}
	}
	m.SpecialCosts = newCosts
}

func (m *MockRepository) GetUser() (*models.User, error) {
	if len(m.Users) > 0 {
		return &m.Users[0], nil
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) UpdateUserCurrentAmount(amount int) error {
	if len(m.Users) > 0 {
		m.Users[0].CurrentAmount = amount
		return nil
	}
	return errors.New("user not found")
}

func (m *MockRepository) Create(user *models.User) error {
	user.ID = uint(len(m.Users) + 1)
	m.Users = append(m.Users, *user)
	return nil
}

func (m *MockRepository) GetByEmail(email string) (*models.User, error) {
	for _, u := range m.Users {
		if u.Email == email {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) GetByID(id uint) (*models.User, error) {
	for _, u := range m.Users {
		if u.ID == id {
			return &u, nil
		}
	}
	return nil, errors.New("user not found")
}

func (m *MockRepository) Update(user *models.User) error {
	for i, u := range m.Users {
		if u.ID == user.ID {
			m.Users[i] = *user
			return nil
		}
	}
	return errors.New("user not found")
}
