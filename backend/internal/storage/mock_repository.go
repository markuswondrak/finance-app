package storage

import "wondee/finance-app-backend/internal/models"

// MockRepository implements Repository for testing
type MockRepository struct {
	FixedCosts   []models.FixedCost
	SpecialCosts []models.SpecialCost
}

func (m *MockRepository) LoadFixedCosts() *[]models.FixedCost {
	return &m.FixedCosts
}

func (m *MockRepository) SaveFixedObject(cost *models.FixedCost) {
	found := false
	for i, c := range m.FixedCosts {
		if c.ID == cost.ID {
			m.FixedCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		m.FixedCosts = append(m.FixedCosts, *cost)
	}
}

func (m *MockRepository) DeleteFixedCost(id int) {
	var newCosts []models.FixedCost
	for _, c := range m.FixedCosts {
		if c.ID != id {
			newCosts = append(newCosts, c)
		}
	}
	m.FixedCosts = newCosts
}

func (m *MockRepository) LoadSpecialCosts() *[]models.SpecialCost {
	return &m.SpecialCosts
}

func (m *MockRepository) SaveSpecialCost(cost *models.SpecialCost) {
	found := false
	for i, c := range m.SpecialCosts {
		if c.ID == cost.ID {
			m.SpecialCosts[i] = *cost
			found = true
			break
		}
	}
	if !found {
		m.SpecialCosts = append(m.SpecialCosts, *cost)
	}
}

func (m *MockRepository) DeleteSpecialCost(id int) {
	var newCosts []models.SpecialCost
	for _, c := range m.SpecialCosts {
		if c.ID != id {
			newCosts = append(newCosts, c)
		}
	}
	m.SpecialCosts = newCosts
}
